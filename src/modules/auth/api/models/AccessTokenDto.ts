import { UserResponse } from "./UserResponse";

export interface AccessTokenDto {
  access_token: string;
  token_type: string;
  user_response : UserResponse;
}
