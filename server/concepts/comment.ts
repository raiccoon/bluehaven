import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

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
  public readonly posts = new DocCollection<CommentDoc>("comments");
}

// instructor edited -- should it be changed back
