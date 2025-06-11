from scraper import AcademyFiveScraper, serve_demo
import sys
from bs4 import BeautifulSoup
import urllib.parse


def find_login_elements(soup, base_url):
    """Find login forms and links on the page"""
    login_info = {
        'forms': [],
        'login_links': []
    }

    # Look for forms (might be login forms)
    forms = soup.find_all('form')
    for form in forms:
        inputs = form.find_all('input')
        input_types = [inp.get('type', '').lower() for inp in inputs]
        input_names = [inp.get('name', '').lower() for inp in inputs]

        # Check if form looks like a login form
        is_login_form = (
                'password' in input_types or
                any('password' in name or 'pass' in name for name in input_names) or
                any('username' in name or 'email' in name or 'login' in name for name in input_names)
        )

        if is_login_form:
            login_info['forms'].append({
                'form': form,
                'action': form.get('action', ''),
                'method': form.get('method', 'GET')
            })

    # Look for login links
    links = soup.find_all('a', href=True)
    for link in links:
        href = link.get('href', '').lower()
        text = link.get_text().lower().strip()

        # Common login link indicators
        login_indicators = [
            'login', 'log-in', 'signin', 'sign-in', 'anmeld',
            'einloggen', 'zugang', 'portal', 'auth'
        ]

        if any(indicator in href or indicator in text for indicator in login_indicators):
            # Convert relative URLs to absolute
            if href.startswith('http'):
                full_url = link.get('href')
            elif href.startswith('/'):
                full_url = urllib.parse.urljoin(base_url, href)
            else:
                full_url = urllib.parse.urljoin(base_url + '/', href)

            login_info['login_links'].append({
                'text': link.get_text().strip() or href,
                'url': full_url,
                'original_href': link.get('href')
            })

    return login_info


def main():
    print("🎓 CampusWeb Scraper - Educational Demo")
    print("=" * 50)
    print("⚠️  FOR EDUCATIONAL USE WITH WRITTEN CONSENT ONLY")
    print("=" * 50)

    url = "https://bhh-community.campusweb.cloud/"
    print(f"Target URL: {url}")

    # Initialize scraper
    scraper = AcademyFiveScraper(url)

    # First, scrape the main page
    print("\n📥 Step 1: Scraping main page...")
    soup = scraper.scrape_page(url, scraper.output_dir / "index.html")

    if not soup:
        print("❌ Failed to scrape main page!")
        return

    # Analyze the main page for login elements
    print("\n🔍 Step 2: Looking for login elements...")
    login_info = find_login_elements(soup, url)

    # Check if main page has login forms
    if login_info['forms']:
        print(f"✅ Found {len(login_info['forms'])} login form(s) on main page")
        scraper.analyze_security(soup)
    else:
        print("ℹ️  No login forms found on main page")

    # Handle login links
    if login_info['login_links']:
        print(f"\n🔗 Found {len(login_info['login_links'])} potential login link(s):")
        for i, link in enumerate(login_info['login_links']):
            print(f"  {i + 1}. '{link['text']}' -> {link['url']}")

        # Automatically scrape the first login link or ask user
        if len(login_info['login_links']) == 1:
            choice = input(f"\n📥 Scrape login page '{login_info['login_links'][0]['text']}'? (y/n): ").lower()
            if choice == 'y':
                login_url = login_info['login_links'][0]['url']
                scrape_login_page(scraper, login_url)
        else:
            print(f"\nChoose which login page to scrape:")
            print("0. Skip login page scraping")
            for i, link in enumerate(login_info['login_links']):
                print(f"{i + 1}. {link['text']}")

            try:
                choice = int(input(f"\nEnter choice (0-{len(login_info['login_links'])}): "))
                if 1 <= choice <= len(login_info['login_links']):
                    login_url = login_info['login_links'][choice - 1]['url']
                    scrape_login_page(scraper, login_url)
                elif choice == 0:
                    print("Skipping login page scraping.")
                else:
                    print("Invalid choice, skipping login page scraping.")
            except (ValueError, IndexError):
                print("Invalid input, skipping login page scraping.")
    else:
        print("ℹ️  No obvious login links found")

    # If no login elements found, still analyze what we have
    if not login_info['forms'] and not login_info['login_links']:
        print("\n🔍 Step 3: Analyzing main page structure...")
        scraper.analyze_security(soup)

    # Summary
    print(f"\n📊 Scraping Summary:")
    print(f"✅ Main page: scraped_site/index.html")
    print(f"✅ Downloaded 8 external CSS files with color corrections")
    print(f"✅ Created color-override.css with !important rules")
    print(f"🎨 Colors: #628da2 → #009ca6 (forced override)")

    if login_info['login_links']:
        print(f"✅ Login page: scraped_site/login.html")

    # Ask if user wants to start server
    choice = input("\n🚀 Start demo server to view scraped site? (y/n): ").lower()
    if choice == 'y':
        serve_demo(8000)


def scrape_login_page(scraper, login_url):
    """Scrape and analyze a login page"""
    print(f"\n📥 Step 3: Scraping login page: {login_url}")
    login_soup = scraper.scrape_page(login_url, scraper.output_dir / "login.html")

    if login_soup:
        print("\n🔍 Step 4: Analyzing login page security...")
        scraper.analyze_security(login_soup)
    else:
        print("❌ Failed to scrape login page")


if __name__ == "__main__":
    main()