## Example 2: homepage w/ section contents + sidebar

This example has the contents of a section + the sidebar on the homepage.

To enable this functionality:
 - Ensure that there are no `[[params.menu]]` entries in your `config.toml` (which cause the list of links to be displayed, as per option 1 above).
 - Create a `/content/_index.md`. The content of that page will render as the homepage.
 - In the [frontmatter](https://gohugo.io/content-management/front-matter/) for the [`/content/_index.md`](content/_index.md), add a `display_section` key. The name of that section will be used to render a list of content.

Note that both the content and the `display_section` key are optional. If your `_index.md` only contains content, it will be centered in the page.

## Build / serve

From the example directory, run

```sh
hugo serve --themesDir ../../..
```
