import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommentMultimedia {
  image?: string;
  video?: string;
}

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  parent: ObjectId;
  content: string;
  instructorEdited: boolean;
  multimedia?: CommentMultimedia;
}

export default class CommentConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async create(author: ObjectId, parent: ObjectId, content: string, multimedia?: CommentMultimedia) {
    const _id = await this.comments.createOne({ author, parent, content, multimedia });
    return { msg: "Comment successfully created!", comment: await this.comments.readOne({ _id }) };
  }

  async isComment(_id: ObjectId) {
    const item = await this.comments.readOne(_id);
    return item !== null;
  }

  async getComments(query: Filter<CommentDoc>) {
    const comments = await this.comments.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return comments;
  }

  async getCommentsByParent(parent: ObjectId) {
    return await this.getComments({ parent });
  }

  async getParentOfComment(_id: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (comment !== null) {
      return comment.parent;
    }
  }

  async deleteComment(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }

  async isAuthor(_id: ObjectId, userId: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== userId.toString()) {
      throw new CommentAuthorNotMatchError(userId, _id);
    }
  }

  async update(_id: ObjectId, update: Partial<CommentDoc>) {
    this.sanitizeUpdate(update);
    await this.comments.updateOne({ _id }, update);
    return { msg: "Comment successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted successfully!" };
  }

  private sanitizeUpdate(update: Partial<CommentDoc>) {
    // Make sure the update cannot change the author or parent.
    const allowedUpdates = ["content", "multimedia", "instructorEdited"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  async hasInstructorEdited(_id: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    return comment.instructorEdited;
  }
}

export class CommentAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of comment {1}!", author, _id);
  }
}