import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface PinDoc extends BaseDoc {
  post: ObjectId;
  comment: ObjectId;
}

export default class PinConcept {
  public readonly pins = new DocCollection<PinDoc>("pins");

  async addPin(postId: ObjectId, commentId: ObjectId) {
    const pin = await this.pins.readOne({ comment: commentId });
    if (pin !== undefined) {
      throw new AlreadyPinned(commentId);
    }
    return await this.pins.createOne({ post: postId, comment: commentId });
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
    super("You have already pinned {}", comment);
  }
}