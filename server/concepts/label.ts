import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface LabelDoc extends BaseDoc {
  name: String;
  classId: ObjectId;
}

export interface LabelsOnCommentsDoc extends BaseDoc {
  label: ObjectId;
  comment: ObjectId;
}

export default class LabelConcept {
  public readonly labels;
  public readonly labelsOnComments;

  constructor() {
    this.labels = new DocCollection<LabelDoc>("labels");
    this.labelsOnComments = new DocCollection<LabelsOnCommentsDoc>("labelsOnComments");
  }

  async createLabel(classId: ObjectId, name: string) {
    const _id = await this.labels.createOne({ name, classId });
    return { msg: "Label created successfully!", label: await this.labels.readOne({ _id }) };
  }

  async getLabel(_id: ObjectId) {
    return await this.labels.readOne({ _id });
  }

  async assignLabel(label: ObjectId, comment: ObjectId) {
    await this.assertLabelNotOnComment(label, comment);
    await this.labelsOnComments.createOne({ label, comment });
    return { msg: "Sucessfully added label to comment!" };
  }

  async removeLabel(label: ObjectId, comment: ObjectId) {
    await this.labelsOnComments.deleteOne({ label, comment });
    return { msg: "Successfully removed label from comment!" };
  }

  async removeAllLabels(comment: ObjectId) {
    await this.labelsOnComments.deleteMany({ comment: comment });
    return { msg: "Successfully removed all labels from comment!" };
  }

  async getLabelsOnComment(comment: ObjectId) {
    const pairs = await this.labelsOnComments.readMany({ comment });
    const labelIds = pairs.map((labelsOnComments) => labelsOnComments.label);
    return this.labels.readMany({ _id: { $in: labelIds } });
  }

  async filterCommentsByLabel(comments: ObjectId[], label: ObjectId) {
    const pairs = await this.labelsOnComments.readMany({ label: label, comment: { $in: comments } });
    return pairs.map((labelOnComment) => labelOnComment.comment);
  }

  async getLabelsInClass(classId: ObjectId) {
    return await this.labels.readMany({ classId });
  }

  async isLabelInClass(label: ObjectId, classId: ObjectId) {
    return (await this.labels.readOne({ _id: label, classId })) !== null;
  }

  async assertIsLabelInClass(label: ObjectId, classId: ObjectId) {
    if ((await this.labels.readOne({ _id: label, classId: classId })) === null) {
      throw new NotFoundError("Cannot find label in class");
    }
  }

  async assertLabelNotOnComment(label: ObjectId, comment: ObjectId) {
    if ((await this.labelsOnComments.readOne({ label, comment })) !== null) {
      throw new NotFoundError("Label is already on comment");
    }
  }

  async generateStatisticsClass(classId: ObjectId) {
    const labelsInCLass = await this.getLabelsInClass(classId);
    return Promise.all(labelsInCLass.map((label) => this.labelsOnComments.count({ label })));
  }
}
