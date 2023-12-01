import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

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
    return { msg: "Bookmark deleted successfully!" };
  }

  async getBookmarkedPosts(user: ObjectId) {
    const bookMarks = await this.bookmarks.readMany({ user: user });
    return bookMarks;
  }

  async isAuthor(_id: ObjectId, user: ObjectId) {
    const bookmark = await this.bookmarks.readOne({ _id });
    if (!bookmark) {
      throw new NotFoundError(`Bookmark ${_id} does not exist!`);
    }
    if (bookmark.owner.toString() !== user.toString()) {
      throw new BookmarkAuthorNotMatchError(user, _id);
    }
  }
}

export class BookmarkAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}

export class AlreadyBookmarked extends NotAllowedError {
  constructor(public readonly post: ObjectId) {
    super("You have already bookmarked {0}", post);
  }
}
