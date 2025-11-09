import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import BookmarksPage from '../pages/bookmarks-page.js';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/bookmarks': new BookmarksPage(),
  '/add-story': new AddStoryPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
};

export default routes;