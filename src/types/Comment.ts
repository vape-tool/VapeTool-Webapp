import { Comment as FirebaseComment } from '@vapetool/types';

export interface Comment extends FirebaseComment {
  uid: string;
}
