import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface PinDoc extends BaseDoc {
  post: ObjectId;
  comment: ObjectId;
}

export default class PinConcept {
  public readonly pins = new DocCollection<PinDoc>("pins");

  async addPin(postId: ObjectId, commentId: ObjectId) {
    const pin = await this.pins.readOne({ comment: commentId });
    if (pin !== null) {
      throw new AlreadyPinned(commentId);
    }
    return await this.pins.createOne({ post: postId, comment: commentId });
  }

  async getPostOfPin(_id: ObjectId) {
    const pin = await this.pins.readOne({ _id });
    if (pin === null) {
      throw new NotFoundError("Pin with id {0} is not found", _id);
    }
    return pin!.post;
  }

  async deletePin(_id: ObjectId) {
    await this.pins.deleteOne({ _id });
    return { msg: "Pin deleted successfully!" };
  }

  async getPostPins(post: ObjectId) {
    const pins = await this.pins.readMany({ post: post });
    return pins;
  }
}

export class AlreadyPinned extends NotAllowedError {
  constructor(public readonly comment: ObjectId) {
    super("You have already pinned {0}", comment);
  }
}
