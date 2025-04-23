# Paperesque

A lightweight [Hugo](https://gohugo.io) theme with a couple of neat tricks.

You can see it in action on [capnfabs.net](https://capnfabs.net).

Here's what makes it special:

- Has a shortcode for resizing images to fit the page, _and_ tools for removing originals from the output
- Footnotes turn into margin notes when there's enough space.
- Tools for editing and controlling publication:
  - Visual differentiation for drafts
  - The ability to "mostly hide" pages so that they're only accessible by knowing the URL.

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

You've got two options for the homepage:

#### 1. A custom list of links.

**Example**: see [examples/1-with-homepage-menu](examples/1-with-homepage-menu/).

This was the _only_ thing supported until Dec 2022-ish.

See the [example readme](examples/1-with-homepage-menu/README.md) for details on how to implement this.

#### 2. A section + custom content in a sidebar.

**Example**: see [examples/2-with-homepage-sidebar-content](examples/2-with-homepage-sidebar-content/).

This is what's in use on capnfabs.net today. I like it much better.

See the [example readme](examples/2-with-homepage-sidebar-content/README.md) for details on how to implement this.

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

### Make pages only visible / accessible by URL

You can prevent a page from being publicly visible (included in lists etc) by adding the following to your front-matter:

```toml
sitemap:
    disable: true
params:
    mostlyHidden: true
```

- Note that `sitemap.disable` is only available since [Hugo 0.125.0](https://github.com/gohugoio/hugo/releases/tag/v0.125.0), so ensure you're building with that if you're relying upon this feature.

## Testing against the example site

You can build the example site with this theme with:

```
cd examples/[example]
hugo serve --themesDir=../../..
```

## Hacking / Modifying the JS

The javascript in use (`assets/js/main.js`) is built from the `./js/` directory. Here are instructions for how to modify the JS:

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
npx parcel watch
```

Simple as that!

### Production builds (i.e. before you commit code / deploy code)

```sh
npx parcel build --no-source-maps
```

### Other resources

- The explanation for how a lot of this works is in [this blog post](https://capnfabs.net/posts/hugo-theme-exclude-processed-images/), so take a look there if you get stuck or want to borrow some of the ideas without grabbing all of them.
- You can see who else is using this theme by [searching Github for `paperesque filename:config.toml`](https://github.com/search?q=paperesque+filename%3Aconfig.toml&type=Code) (requires login).
