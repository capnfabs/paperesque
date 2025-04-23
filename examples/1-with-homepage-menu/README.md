## Example 1: static links on the homepage

This example has a list of static links on the homepage. This was the default until Dec 2022.

To enable this functionality, add `[[params.menu]]` entries in your `config.toml` file, like this:

```toml
[[params.menu]]
  name = "blog"
  url = "posts/"

[[params.menu]]
  name = "tags"
  url = "tags/"

# ... etc
```


## Build / serve

From the example directory, run

```sh
hugo serve --themesDir ../../..
```
