export type Profile = {
  id: number;
  fullname: string;
  email: string;
  username?: string;
  avatar?: string | null;
};

/**
 * Maps DummyJSON user data to our Profile type
 */
export function mapToProfile(user: any): Profile {
  return {
    id: user.id,
    fullname: `${user.firstName} ${user.lastName}`,
    email: user.email,
    username: user.username,
    avatar: user.image || null,
  };
}
