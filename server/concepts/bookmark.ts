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
    const bookMarks = await this.bookmarks.readMany({ post: post });
    for (const bookMark of bookMarks) {
      if (bookMark !== null && bookMark.owner.toString() === owner.toString()) {
        throw new AlreadyBookmarkedError(owner, post);
      }
    }
    const createdBookmark = await this.bookmarks.createOne({ owner, post, classId });
    return createdBookmark;
  }

  async isBookmark(owner: ObjectId, post: ObjectId) {
    const bookmark = await this.bookmarks.readOne({ owner: owner, post: post });
    return bookmark !== null;
  }

  async deleteBookmark(_id: ObjectId) {
    await this.bookmarks.deleteOne({ _id });
    return { msg: "Bookmark deleted successfully!" };
  }

  async deleteBookmarkByPost(owner: ObjectId, post: ObjectId) {
    await this.bookmarks.deleteOne({ owner: owner, post: post });
    return { msg: "Bookmark deleted successfully!" };
  }

  async getBookmarkedPosts(user: ObjectId) {
    const bookMarks = await this.bookmarks.readMany(
      { owner: user },
      {
        sort: { dateUpdated: -1 },
      },
    );

    return bookMarks;
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
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

export class AlreadyBookmarkedError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly post: ObjectId,
  ) {
    super("{0} has already bookmarked {1}!", author, post);
  }
}
