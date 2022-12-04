# Paperesque

A lightweight [Hugo](https://gohugo.io) theme with a couple of neat tricks.

You can see it in action on [capnfabs.net](https://capnfabs.net), or on the [Hugo Themes Example Site](https://themes.gohugo.io/theme/paperesque/).

Here's what makes it special:

- Has a shortcode for resizing images to fit the page, _and_ tools for removing originals from the output
- Visual differentiation for drafts
- Footnotes turn into margin notes when there's enough space.

## Install


### git subtree (easiest!)

Copy the files into your repo using `git subtree` (this is way easier to use than submodules; [here's an explainer](https://www.atlassian.com/git/tutorials/git-subtree)):

```sh
git subtree add --prefix themes/paperesque https://github.com/capnfabs/paperesque mainline --squash
```

This will add a commit to your repo with everything ready to go. You'll probably want to modify parts of this theme for your own usage! Subtree makes that easy, because you've just copied the code into your repo ✨

### git submodules

If you're sure you want to use git submodules:

```sh
git submodule add -b mainline https://github.com/capnfabs/paperesque themes/paperesque
```

### Select the theme in your `config.toml`

Add / Modify the `theme` field in your `config.toml` for your hugo site:

```toml
theme = "paperesque"
```

## Using Features

### Homepage

You've got a bunch of options for the homepage:

#### 1. A custom list of links.

This was the _only_ thing supported until recently (Dec 2022-ish).

Add something like this to your site's `config.toml`:

```toml
[[params.menu]]
  name = "blog"
  url = "posts/"

[[params.menu]]
  name = "tags"
  url = "tags/"

[[params.menu]]
  name = "about"
  url = "about/"

[[params.menu]]
  name = "contact"
  url = "contact/"
```

#### 2. Markdown content

You can create a `/content/_index.md` and the content of that page will render as the homepage.

#### 3. A section

You can create a `/content/_index.md` and in the [frontmatter](https://gohugo.io/content-management/front-matter/) add a `display_section` key. The name of that section will be used to render a list of content.

### 4. A section + custom content in a sidebar.

Do the same as for option 3 ('a section'), but also include markdown content in that file. The markdown content will render on the left as a sidebar, and the list of section items will render in the main panel.

### Links in the top-right corner

These are config driven! Add this to your `config.toml` (for example):

```toml
[[params.topmenu]]
  name = "about"
  url = "about/"

[[params.topmenu]]
  name = "contact"
  url = "contact/"

[[params.topmenu]]
  name = "rss"
  url = "posts/index.xml"
```

### Removing original images after resizing

The `fitfigure` shortcode is exactly the same as the `figure` shortcode, but it automatically resizes your images to fit the container, _and_ provides different resolutions for different DPIs (1x, 2x).

Whenever you use this shortcode, the theme makes a mental note of the resource you specified.

Now, you need to do some configuration if you want the originals to be removed from the output.

First, add this to your site's `config.toml`:

```toml
[outputs]
page = ["HTML", "droplist"]
```

Now, as part of your build process, run:

```sh
./themes/paperesque/buildscripts/drop-resources.py [hugo-output-directory]
```

(the Hugo output directory is usually `./public`).

That's it! Resized resources will be removed.

This is _off by default_ because it peppers your build output with `.droplist` files, and if you're not expecting them, it's going to be an unpleasant surprise.

### Visual differentiation for drafts

This one's on, and can't be switched off. Drafts have an orange stripey background everywhere. You can't miss them.

### Footnotes turn into margin notes

This is _on by default_.

You can switch it off site-wide by adding `disableMarginNotes = true` to your `params` in your `config.toml`, i.e.

```toml
[params]
disableMarginNotes = true
```

Alternatively, you can turn it off per-page by adding the `disableMarginNotes = true` to your front-matter for the page.

## Testing against the example site

You can build the example site with this theme with:

```
cd exampleSite
hugo serve --themesDir=../..
```

## Hacking / Modifying the JS

The javascript in use (`static/js/main.js`) is built from the `./js/` directory. Here are instructions for how to modify the JS:

### Set up
First, you need to [install the `yarn` package manager](https://yarnpkg.com/getting-started/install).

Then, run:

```sh
yarn install
```

to install the required dependencies.

### Dev builds

Run:

```sh
yarn run parcel watch
```

Simple as that!

### Production builds (i.e. before you commit code / deploy code)

```sh
yarn run parcel build --no-source-maps
```

_Experimental Scope Hoisting_ inlines Parcel's module loader. It shaves off like 2kB Gzipped. Laugh all you want, but that's half a second at dial-up speeds 😉

### Other resources

- The explanation for how a lot of this works is in [this blog post](https://capnfabs.net/posts/hugo-theme-exclude-processed-images/), so take a look there if you get stuck or want to borrow some of the ideas without grabbing all of them.
- You can see who else is using this theme by [searching Github for `paperesque filename:config.toml`](https://github.com/search?q=paperesque+filename%3Aconfig.toml&type=Code) (requires login).
