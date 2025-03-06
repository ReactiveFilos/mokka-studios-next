export type Profile = {
  id: number;
  firstName: string;
  lastName: string;
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
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    avatar: user.image || null,
  };
}
