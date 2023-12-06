import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Bookmark, Class, Comment, Friend, Label, Module, Pin, Post, User, WebSession } from "./app";
import { CommentDoc } from "./concepts/comment";
import { PostDoc } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  // POST

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  //gets post by post id
  @Router.get("/posts/:_id")
  async getPostById(_id: ObjectId) {
    const idObj = new ObjectId(_id);
    const posts = await Post.getPosts({ _id: idObj });
    return posts[0];
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, module: ObjectId, content: string, image: string, video: string) {
    const user = WebSession.getUser(session);
    const classId = await Module.getClassOfModule(new ObjectId(module));
    await Class.assertIsInstructor(new ObjectId(classId!), user);

    const created = await Post.create(user, content, image, video);
    await Module.addPost(created.post!._id, new ObjectId(module));
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, new ObjectId(_id));
    return await Post.update(new ObjectId(_id), update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const classId = await Module.getClassOfPost(new ObjectId(_id));
    await Class.assertIsInstructor(new ObjectId(classId!), user);

    await Module.removePost(new ObjectId(_id));
    return Post.delete(new ObjectId(_id));
  }

  // COMMENT

  @Router.post("/comments")
  async createComment(session: WebSessionDoc, parent: ObjectId, content: string, image: string, video: string) {
    const user = WebSession.getUser(session);
    const created = await Comment.create(user, new ObjectId(parent), content, image, video);
    if (created.comment !== null) {
      const parentPost = await Comment.getPostParent(created.comment._id);
      const commentClass = await Module.getClassOfPost(parentPost!);
      await Class.assertIsMember(commentClass!, user);
    }
    return { msg: created.msg, comment: await Responses.post(created.comment) };
  }

  @Router.get("/comments")
  async getComments(parentId?: ObjectId) {
    let comments;
    if (parentId) {
      comments = await Comment.getCommentsByParent(new ObjectId(parentId));
    } else {
      comments = await Comment.getComments({});
    }
    return Responses.posts(comments);
  }

  @Router.get("/parent/:_id")
  async getParentofComment(_id: ObjectId) {
    const parent = await Comment.getParentOfComment(new ObjectId(_id));
    if (parent !== undefined && (await Comment.isComment(parent))) {
      return { msg: "Comment", parent_id: parent };
    } else if (parent !== undefined) {
      return { msg: "Post", parent_id: parent };
    }
    return parent;
  }

  @Router.patch("/comments/:_id")
  async updateComment(session: WebSessionDoc, _id: ObjectId, update: Partial<CommentDoc>) {
    const user = WebSession.getUser(session);

    const parentPost = await Comment.getPostParent(new ObjectId(_id));
    const commentClass = await Module.getClassOfPost(parentPost!);

    const isInstructor = await Class.isInstructor(commentClass!, user);
    await Comment.canEdit(new ObjectId(_id), user, isInstructor);

    if (isInstructor) {
      // set to true if an instructor made the edit regardless of author
      await Comment.commentSetInstructorEdited(new ObjectId(_id));
    }

    return await Comment.update(new ObjectId(_id), update);
  }

  @Router.delete("/comments/:_id")
  async deleteComment(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);

    const parentPost = await Comment.getPostParent(new ObjectId(_id));
    const commentClass = await Module.getClassOfPost(parentPost!);

    const isInstructor = await Class.isInstructor(commentClass!, user);
    await Comment.canEdit(new ObjectId(_id), user, isInstructor);
    return await Comment.delete(new ObjectId(_id));
  }

  @Router.get("/comments/:_id/class")
  async getClassOfComment(_id: ObjectId) {
    let parent = await Comment.getParentOfComment(new ObjectId(_id));
    while (await Comment.isComment(parent!)) {
      parent = await Comment.getParentOfComment(parent!);
    }
    return await Module.getClassOfPost(parent!);
  }

  // BOOKMARK

  @Router.post("/bookmarks")
  async createBookmark(session: WebSessionDoc, post: ObjectId, classId: ObjectId) {
    const user = WebSession.getUser(session);
    const created = await Bookmark.addBookmark(user, new ObjectId(post), new ObjectId(classId));
    return created;
  }

  @Router.delete("/bookmarks/:_id")
  async deleteBookmark(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Bookmark.isAuthor(user, new ObjectId(_id));
    return await Bookmark.deleteBookmark(new ObjectId(_id));
  }

  @Router.get("/bookmarks")
  async getBookmarkedPosts(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return Bookmark.getBookmarkedPosts(user);
  }

  // PINS ROUTES

  @Router.post("/pins")
  async addPin(session: WebSessionDoc, postId: ObjectId, commentId: ObjectId) {
    const user = WebSession.getUser(session);
    const postClass = await Module.getClassOfPost(new ObjectId(postId));
    await Class.assertIsInstructor(new ObjectId(postClass!), user);
    const created = await Pin.addPin(new ObjectId(postId), new ObjectId(commentId));
    return created;
  }

  @Router.delete("/pins/:_id")
  async deletePin(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const post = await Pin.getPostOfPin(new ObjectId(_id));
    const pinClass = await Module.getClassOfPost(post);
    await Class.assertIsInstructor(pinClass!, user);
    return await Pin.deletePin(new ObjectId(_id));
  }

  @Router.delete("/pins/comment/:_id")
  async deletePinByCommentId(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const post = await Comment.getPostParent(new ObjectId(_id));
    const pinClass = await Module.getClassOfPost(new ObjectId(post.id));
    await Class.assertIsInstructor(pinClass!, user);
    return await Pin.deletePinByCommentId(new ObjectId(_id));
  }

  // @Router.get("/pins/:postId")
  // async getPinsOnPost(session: WebSessionDoc, postId: ObjectId) {
  //   const user = WebSession.getUser(session);
  //   const post = await Pin.getPostOfPin(new ObjectId(postId));
  //   const pinClass = await Module.getClassOfPost(post);
  //   await Class.assertIsMember(pinClass!, user);
  //   return await Pin.getPostPins(postId);
  // }

  @Router.get("/pins/comments/:postId")
  async getCommentsPinnedOrder(postId: ObjectId) {
    // returns 2 sets, pinned comments followed by unpinned comments

    const postObjectID = new ObjectId(postId);
    const pins = await Pin.getPostPins(postObjectID);
    let comments = await Comment.getCommentsByParent(postObjectID);

    const pinnedCommentsAlone = pins.map((pin) => pin.comment.toString());
    comments = comments.filter((comment) => pinnedCommentsAlone.indexOf(comment._id.toString()) === -1);
    const pinnedComments = await Promise.all(pins.map(async (pin) => await Comment.getComment(pin.comment)));

    return { "Pinned Comments": await Responses.posts(pinnedComments), "UnPinned Comments": await Responses.posts(comments) };
  }

  // FRIENDS
  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  // CLASS
  @Router.post("/classes")
  async createClass(session: WebSessionDoc, className: string) {
    const user = WebSession.getUser(session);
    return await Class.createClass(user, className);
  }

  @Router.get("/classes/id/:classId")
  async getClass(session: WebSessionDoc, classId: ObjectId) {
    const user = WebSession.getUser(session);
    return await Class.getClassById(new ObjectId(classId), user);
  }

  @Router.post("/classes/id/:classId/instructors")
  async inviteInstructor(session: WebSessionDoc, classId: ObjectId, inviteeName: string) {
    const inviter = WebSession.getUser(session);
    const invitee = (await User.getUserByUsername(inviteeName))._id;
    return await Class.inviteInstructor(new ObjectId(classId), inviter, invitee);
  }

  @Router.post("/classes/joincode/:joinCode/students")
  async joinByJoinCode(session: WebSessionDoc, joinCode: string) {
    const student = WebSession.getUser(session);
    return await Class.joinByJoinCode(joinCode, student);
  }

  @Router.get("/classes/instruct")
  async getClassesInstruct(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Class.getClassesInstruct(user);
  }

  @Router.get("/classes/enroll")
  async getClassesEnroll(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Class.getClassesEnroll(user);
  }

  @Router.get("/classes/id/:classId/membership/isInstructor")
  async isInstructor(session: WebSessionDoc, classId: ObjectId, username: string) {
    const user = (await User.getUserByUsername(username))._id;
    return await Class.isInstructor(new ObjectId(classId), user);
  }

  @Router.get("/classes/id/:classId/membership/isStudent")
  async isStudent(session: WebSessionDoc, classId: ObjectId, username: string) {
    const user = (await User.getUserByUsername(username))._id;
    return await Class.isStudent(new ObjectId(classId), user);
  }

  @Router.get("/classes/id/:classId/membership/isMember")
  async isMember(session: WebSessionDoc, classId: ObjectId, username: string) {
    const user = (await User.getUserByUsername(username))._id;
    return await Class.isMember(new ObjectId(classId), user);
  }

  @Router.delete("/classes/id/:classId/membership")
  async removeSelf(session: WebSessionDoc, classId: ObjectId) {
    const user = WebSession.getUser(session);
    return await Class.removeSelf(new ObjectId(classId), user);
  }

  // MODULE
  @Router.post("/modules")
  async createModule(session: WebSessionDoc, classId: ObjectId, name: string, description?: string) {
    const user = WebSession.getUser(session);
    await Class.assertIsInstructor(new ObjectId(classId), user);
    return await Module.createModule(new ObjectId(classId), name, description);
  }

  @Router.get("/modules/:_id")
  async getModule(_id: ObjectId) {
    return await Module.getModule(new ObjectId(_id));
  }

  @Router.get("/modules/:_id/posts")
  async getPostsInModule(_id: ObjectId) {
    const postIds = await Module.getPostsInModule(new ObjectId(_id));
    return await Post.getPosts({ _id: { $in: postIds } });
  }

  @Router.get("/classes/id/:_id/modules")
  async getModulesInClass(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const viewHidden = await Class.isInstructor(new ObjectId(_id), user);
    return await Module.getModulesInClass(new ObjectId(_id), viewHidden);
  }

  @Router.get("/modules/:_id/class")
  async getClassOfModule(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const classId = await Module.getClassOfModule(new ObjectId(_id));
    return await Class.getClassById(classId!, user);
  }

  @Router.get("/posts/:_id/module")
  async getModuleOfPost(_id: ObjectId) {
    const moduleId = await Module.getModuleOfPost(new ObjectId(_id));
    return await Module.getModule(moduleId!);
  }

  @Router.get("/posts/:_id/class")
  async getClassOfPost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const classId = await Module.getClassOfPost(new ObjectId(_id));
    return await Class.getClassById(classId!, user);
  }

  @Router.get("/modules/:module/posts/:post/isInModule")
  async isPostInModule(module: ObjectId, post: ObjectId) {
    return await Module.isPostInModule(new ObjectId(module), new ObjectId(post));
  }

  @Router.get("/classes/id/:classId/posts/:post/isInClass")
  async isPostInClass(classId: ObjectId, post: ObjectId) {
    return await Module.isPostInClass(new ObjectId(classId), new ObjectId(post));
  }

  @Router.put("/post/:_id/module")
  async relocatePost(post: ObjectId, module: ObjectId) {
    return await Module.relocatePost(new ObjectId(post), new ObjectId(module));
  }

  @Router.delete("/modules/:_id")
  async deleteModule(_id: ObjectId) {
    const posts = await Module.getPostsInModule(new ObjectId(_id));
    for (const post of posts) {
      await Post.delete(new ObjectId(post));
    }
    return await Module.deleteModule(new ObjectId(_id));
  }

  @Router.put("/modules/:_id/hidden")
  async updateModuleVisibility(_id: ObjectId, hidden: boolean) {
    return await Module.updateModuleVisibility(new ObjectId(_id), hidden);
  }

  // MODULE - TEMP ROUTES FOR TESTING
  @Router.post("/modules/:module/posts")
  async addPost(post: ObjectId, module: ObjectId) {
    return await Module.addPost(new ObjectId(post), new ObjectId(module));
  }

  // LABELs
  @Router.post("/classes/id/:classId/labels")
  async createLabel(classId: ObjectId, name: string) {
    return await Label.createLabel(new ObjectId(classId), name);
  }

  @Router.post("/comments/:commentId/labels")
  async assignLabel(session: WebSessionDoc, label: ObjectId, comment: ObjectId) {
    // const user = WebSession.getUser(session);
    // const class = this.getClassOfComment(class);
    // await Label.assertIsLabelInClass(new ObjectId(label), class);
    // await canEdit(user, comment);
    return await Label.assignLabel(new ObjectId(label), new ObjectId(comment));
  }

  @Router.delete("/comments/:commentId/labels")
  async removeLabel(label: ObjectId, comment: ObjectId) {
    return await Label.removeLabel(new ObjectId(label), new ObjectId(comment));
  }

  @Router.get("/comments/:commentId/labels")
  async getLabelsOnComment(comment: ObjectId) {
    return await Label.getLabelsOnComment(new ObjectId(comment));
  }

  @Router.get("/classes/id/:classId/labels")
  async getLabelsInClass(classId: ObjectId) {
    return await Label.getLabelsInClass(new ObjectId(classId));
  }

  @Router.get("/classes/id/:classId/labels/isLabelInClass")
  async isLabelInClass(classId: ObjectId, label: ObjectId) {
    return await Label.isLabelInClass(new ObjectId(label), new ObjectId(classId));
  }

  @Router.get("/classes/id/:classId/labels/statistics")
  async generateLabelStatistics(classId: ObjectId) {
    return await Label.generateStatisticsClass(new ObjectId(classId));
  }
}

export default getExpressRouter(new Routes());
