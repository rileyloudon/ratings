import { redirect } from 'next/navigation';

const NotFound = () => {
  // Links when rendering this file don't seem to work. For now, just redirect back to home.
  return redirect('/');
};

export default NotFound;
