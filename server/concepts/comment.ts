import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommentMultimedia {
  image?: string;
  video?: string;
}

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  parentId: ObjectId;
  content: string;
  instructorEdited: boolean;
  image: string;
  video: string;
}

export default class CommentConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async create(author: ObjectId, parentId: ObjectId, content: string, image: string, video: string) {
    const _id = await this.comments.createOne({ author, parentId, content, instructorEdited: false, image, video });
    return { msg: "Comment successfully created!", comment: await this.comments.readOne({ _id }) };
  }

  async isComment(_id: ObjectId) {
    const item = await this.comments.readOne({ _id });
    return item !== null;
  }

  async getComments(query: Filter<CommentDoc>) {
    const comments = await this.comments.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return comments;
  }

  async getCommentsByParent(parentId: ObjectId) {
    return await this.getComments({ parentId });
  }

  async getParentOfComment(_id: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (comment !== null) {
      return comment.parentId;
    }
    throw new NotFoundError("Comment not found");
  }

  async getComment(commentId: ObjectId) {
    const commentDoc = await this.comments.readOne({ _id: commentId });
    if (commentDoc === null) {
      throw new NotFoundError(`Comment not found!`);
    }
    return commentDoc;
  }

  async deleteComment(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted successfully!" };
  }

  async assertIsAuthor(_id: ObjectId, userId: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== userId.toString()) {
      throw new CommentAuthorNotMatchError(userId, _id);
    }
  }

  async commentSetInstructorEdited(_id: ObjectId) {
    await this.comments.updateOne({ _id }, { instructorEdited: true });
    return { msg: "Comment successfully updated!" };
  }

  async isAuthor(_id: ObjectId, userId: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== userId.toString()) {
      return false;
    }
    return true;
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

  async getPostParent(_id: ObjectId) {
    let parent = await this.getParentOfComment(_id);
    while (await this.isComment(parent!)) {
      parent = await this.getParentOfComment(parent!);
    }
    if (parent === undefined) {
      throw new NotFoundError("Unable to find post for comment {0}", _id);
    }
    return parent;
  }

  async canEdit(commentId: ObjectId, user: ObjectId, isInstructor: boolean) {
    const isAuthor = await this.isAuthor(commentId, user);
    if (!isAuthor && !isInstructor) {
      throw new NotAllowedError("You must be the author or an instructor!");
    }
    return true;
  }

  private sanitizeUpdate(update: Partial<CommentDoc>) {
    // Make sure the update cannot change the author or parent.
    const allowedUpdates = ["content", "image", "video", "instructorEdited"];
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
