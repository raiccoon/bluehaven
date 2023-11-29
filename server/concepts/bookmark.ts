import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface BookmarkDoc extends BaseDoc {
  owner: ObjectId;
  post: ObjectId;
  classId: ObjectId;
}

export default class BookmarkConcept {
  public readonly bookmarks = new DocCollection<BookmarkDoc>("bookmarks");

  async addBookmark(owner: ObjectId, post: ObjectId, classId: ObjectId) {
    const bookMark = await this.bookmarks.readOne({ post: post });
    if (bookMark !== undefined) {
      throw new AlreadyBookmarked(post);
    }
    return await this.bookmarks.createOne({ owner, post, classId });
  }

  async deleteBookmark(_id: ObjectId) {
    await this.bookmarks.deleteOne({ _id });
  }

  async getBookmarkedPosts(user: ObjectId) {
    const bookMarks = await this.bookmarks.readMany({ user: user });
    return bookMarks;
  }
}

export class AlreadyBookmarked extends NotAllowedError {
  constructor(public readonly post: ObjectId) {
    super("You have already bookmarked {}", post);
  }
}
