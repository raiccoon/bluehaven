import BookmarkConcept from "./concepts/bookmark";
import ClassConcept from "./concepts/class";
import CommentConcept from "./concepts/comment";
import FriendConcept from "./concepts/friend";
import PostConcept from "./concepts/post";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Class = new ClassConcept();
export const Comment = new CommentConcept();
export const Bookmark = new BookmarkConcept();
