import { Post, User } from "./app";
import { AlreadyBookmarkedError } from "./concepts/bookmark";
import { CommentDoc } from "./concepts/comment";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/post";
import { Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert Comment / PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(item: CommentDoc | PostDoc | null) {
    if (!item) {
      return item;
    }
    const author = await User.getUserById(item.author);
    return { ...item, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc / CommentDoc for improved performance.
   */
  static async posts(items: PostDoc[] | CommentDoc[]) {
    const authors = await User.idsToUsernames(items.map((item) => item.author));
    return items.map((item, i) => ({ ...item, author: authors[i] }));
  }
}

Router.registerError(AlreadyBookmarkedError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  const post = await Post.getPosts({ _id: e.post });
  return e.formatWith(username, post[0].title);
});

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});
