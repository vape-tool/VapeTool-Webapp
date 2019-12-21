import { Comment as FirebaseComment } from '@vapetool/types';

export default interface Comment extends FirebaseComment {
  uid: string;
}
