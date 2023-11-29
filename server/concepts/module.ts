import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface ModuleDoc extends BaseDoc {
  name: String;
  description: String;
  classId: ObjectId;
  hidden: boolean;
}

export interface PostLocationDoc extends BaseDoc {
  post: ObjectId;
  module: ObjectId;
}

export default class ModuleConcept {
  public readonly modules;
  public readonly postLocations;

  constructor() {
    this.modules = new DocCollection<ModuleDoc>("modules");
    this.postLocations = new DocCollection<PostLocationDoc>("postLocations");
  }

  async createModule(classId: ObjectId, name: string, description?: string) {
    const _id = await this.modules.createOne({ name, description, classId, hidden: true });
    return { msg: "Module created successfully!", module: await this.modules.readOne({ _id }) };
  }

  async getModule(_id: ObjectId) {
    return await this.modules.readOne({ _id });
  }

  async getPostsInModule(module: ObjectId) {
    const pairs = await this.postLocations.readMany({ module });
    return pairs.map((postLocation) => postLocation.post);
  }

  async getClassOfModule(_id: ObjectId) {
    return (await this.modules.readOne({ _id }))?.classId;
  }

  async getModuleOfPost(post: ObjectId) {
    return (await this.postLocations.readOne({ post }))?.module;
  }

  async getClassOfPost(post: ObjectId) {
    const module = await this.getModuleOfPost(post);
    return this.getClassOfModule(module!);
  }

  async isPostInModule(module: ObjectId, post: ObjectId) {
    return (await this.postLocations.readOne({ module, post })) != null;
  }

  async isPostInClass(classId: ObjectId, post: ObjectId) {
    const classOfPost = await this.getClassOfPost(post);
    return classOfPost?.equals(classId);
  }

  async addPost(post: ObjectId, module: ObjectId) {
    await this.postLocations.createOne({ post, module });
    return { msg: "Sucessfully added post to module!" };
  }

  async removePost(post: ObjectId) {
    await this.postLocations.deleteOne({ post });
    return { msg: "Successfully removed post from module!" };
  }

  async relocatePost(post: ObjectId, module: ObjectId) {
    await this.removePost(post);
    await this.addPost(post, module);
    return { msg: "Successfully moved post to different module!" };
  }

  async deleteModule(module: ObjectId) {
    await this.modules.deleteOne({ _id: module });
    return { msg: "Sucessfully deleted module!" };
  }
}
