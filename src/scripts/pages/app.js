import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import Auth from '../utils/auth';

const protectedRoutes = ['/add-story'];

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #navigationList = null;
  #currentRoute = null;

  constructor({
    navigationDrawer, drawerButton, content, navigationList,
  }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#navigationList = navigationList;

    this._setupDrawer();
  }

  _setupNavigation() {
    if (Auth.isLoggedIn()) {
      this.#navigationList.innerHTML = `
        <li><a href="#/">Beranda</a></li>
        <li><a href="#/add-story">Add Story</a></li>
        <li><a href="#/bookmarks">Lokasi Favorit</a></li>
        <li><a href="#/about">About</a></li>
        <li><button id="logout-button">Logout</button></li>
      `;
      this.#navigationList.querySelector('#logout-button').addEventListener('click', (event) => {
        event.preventDefault();
        Auth.clearToken();
        window.location.hash = '#/login';
      });
    } else {
      this.#navigationList.innerHTML = `
        <li><a href="#/">Beranda</a></li>
        <li><a href="#/bookmarks">Lokasi Favorit</a></li>
        <li><a href="#/login">Login</a></li>
        <li><a href="#/register">Register</a></li>
      `;
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a, button').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async _renderPage() {
    const url = getActiveRoute();

    // Jangan render kalau sudah render route yang sama
    if (this.#currentRoute === url) {
      return;
    }

    // Check protected routes
    if (protectedRoutes.includes(url) && !Auth.isLoggedIn()) {
      // Jangan trigger redirect di sini, biarkan hash change
      this.#currentRoute = '/login';
      return;
    }

    // Check login/register redirect
    if ((url === '/login' || url === '/register') && Auth.isLoggedIn()) {
      // Jangan trigger redirect di sini
      this.#currentRoute = '/';
      return;
    }

    const page = routes[url] || routes['/'];

    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      }).finished;
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }

    this.#currentRoute = url;
  }

  async updateUI() {
    this._setupNavigation();
    await this._renderPage();
  }
}

export default App;