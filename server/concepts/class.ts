import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ClassDoc extends BaseDoc {
  className: String;
  joinCode: String;
  archived: boolean;
}

export interface MembershipDoc extends BaseDoc {
  classId: ObjectId;
  user: ObjectId;
}

export default class ClassConcept {
  public readonly classes;
  public readonly instructorMemberships;
  public readonly studentMemberships;

  constructor() {
    this.classes = new DocCollection<ClassDoc>("classes");
    this.instructorMemberships = new DocCollection<MembershipDoc>("instructorMemberships");
    this.studentMemberships = new DocCollection<MembershipDoc>("studentMemberships");
  }

  async createClass(user: ObjectId, className: string) {
    const joinCode = await this.createUniqueJoinCode();
    const _id = await this.classes.createOne({ className, joinCode, archived: false });
    await this.addInstructor(_id, user);
    return { msg: "Class created successfully!", class: await this.classes.readOne({ _id }) };
  }

  async getClassById(classId: ObjectId, user: ObjectId) {
    const classDoc = await this.classes.readOne({ _id: classId });
    if (classDoc === null) {
      throw new NotFoundError(`Class not found!`);
    }
    await this.assertIsMember(classId, user);
    return classDoc;
  }

  async inviteInstructor(classId: ObjectId, inviter: ObjectId, invitee: ObjectId) {
    await this.classExists(classId);
    await this.assertIsInstructor(classId, inviter);
    if (await this.isInstructor(classId, invitee)) {
      throw new NotAllowedError("User is already an instructor of this class!");
    }
    await this.addInstructor(classId, invitee);
    const isStudent = await this.isStudent(classId, invitee);
    if (isStudent) {
      await this.deleteStudent(classId, invitee);
    }
    return { msg: "Invited user as an instructor!", classId: classId, user: invitee };
  }

  async joinByJoinCode(joinCode: string, student: ObjectId) {
    const classDoc = await this.getClassByJoinCode(joinCode);
    if (await this.isMember(classDoc._id, student)) {
      throw new NotAllowedError("You are already in this class!");
    }
    await this.addStudent(classDoc._id, student);
    return { msg: "Joined class!", classId: classDoc._id };
  }

  async getClassesInstruct(user: ObjectId) {
    const memberships = await this.instructorMemberships.readMany({ user });
    const classIds = memberships.map((membership) => membership.classId);
    const classes = await this.getClassesByIds(classIds, false);
    return { msg: "Class retrieved successfully!", classes };
  }

  async getClassesEnroll(user: ObjectId) {
    const memberships = await this.studentMemberships.readMany({ user });
    const classIds = memberships.map((membership) => membership.classId);
    const classes = await this.getClassesByIds(classIds, false);
    return { msg: "Class retrieved successfully!", classes };
  }

  async getClassesArchive(user: ObjectId) {
    const memberships = await this.instructorMemberships.readMany({ user });
    const classIds = memberships.map((membership) => membership.classId);
    const classes = await this.getClassesByIds(classIds, true);
    return { msg: "Class retrieved successfully!", classes };
  }

  async assertIsInstructor(classId: ObjectId, user: ObjectId) {
    await this.classExists(classId);
    const maybeInstructor = await this.instructorMemberships.readOne({ classId, user });
    if (maybeInstructor === null) {
      const goalClass = await this.classes.readOne({ _id: classId });
      throw new NotAllowedError(`You are not an instructor of class {0}!`, goalClass?.className);
    }
  }

  async isInstructor(classId: ObjectId, user: ObjectId) {
    await this.classExists(classId);
    const maybeInstructor = await this.instructorMemberships.readOne({ classId, user });
    return maybeInstructor != null;
  }

  async isStudent(classId: ObjectId, user: ObjectId) {
    await this.classExists(classId);
    const maybeStudent = await this.studentMemberships.readOne({ classId, user });
    return maybeStudent != null;
  }

  async isMember(classId: ObjectId, user: ObjectId) {
    await this.classExists(classId);
    const maybeInstructor = this.instructorMemberships.readOne({ classId, user });
    const maybeStudent = this.studentMemberships.readOne({ classId, user });
    return (await maybeInstructor) != null || (await maybeStudent) != null;
  }

  async assertIsMember(classId: ObjectId, user: ObjectId) {
    await this.classExists(classId);
    const maybeInstructor = this.instructorMemberships.readOne({ classId, user });
    const maybeStudent = this.studentMemberships.readOne({ classId, user });
    if (!((await maybeInstructor) || (await maybeStudent))) {
      throw new NotAllowedError("You are not a member of class {0}", classId);
    }
  }

  async removeSelf(classId: ObjectId, user: ObjectId) {
    if (await this.isInstructor(classId, user)) {
      await this.deleteInstructor(classId, user);
    } else if (await this.isStudent(classId, user)) {
      await this.deleteStudent(classId, user);
    }
    return { msg: "Sucessfully exited class!" };
  }

  async updateIsClassArchived(classId: ObjectId, archived: boolean) {
    await this.classExists(classId);
    await this.classes.updateOne({ _id: classId }, { archived });
    // await this.studentMemberships.deleteMany({ classId: classId });
    return await this.classes.readOne({ _id: classId });
  }

  // Helpers

  private async classExists(_id: ObjectId) {
    const maybeClass = this.classes.readOne({ _id });
    if (maybeClass === null) {
      throw new NotFoundError("Class not found!");
    }
  }

  private async createUniqueJoinCode() {
    let joinCode = Math.random().toString(36).substring(2, 7);
    while ((await this.classes.readOne({ joinCode })) != null) {
      joinCode = Math.random().toString(36).substring(2, 7);
    }
    return joinCode;
  }

  private async getClassByJoinCode(joinCode: string) {
    const classDoc = await this.classes.readOne({ joinCode });
    if (classDoc === null) {
      throw new NotFoundError(`Class not found!`);
    }
    return classDoc;
  }

  private async getClassesByIds(classIds: ObjectId[], archived: boolean) {
    const classDocs = await this.classes.readMany({ _id: { $in: classIds }, archived: archived });
    return classDocs;
  }

  private async addInstructor(classId: ObjectId, user: ObjectId) {
    await this.instructorMemberships.createOne({ classId, user });
  }

  private async addStudent(classId: ObjectId, user: ObjectId) {
    await this.studentMemberships.createOne({ classId, user });
  }

  private async deleteInstructor(classId: ObjectId, user: ObjectId) {
    await this.instructorMemberships.deleteOne({ classId, user });
  }

  private async deleteStudent(classId: ObjectId, user: ObjectId) {
    await this.studentMemberships.deleteOne({ classId, user });
  }
}
