Renders a link to a This Is My Jam user's profile, with an image, text or both.
If the user has no active jam, renders a simple 'follow me' link.

Usage
-----

    <script src="http://www.thisismyjam.com/includes/js/medallion.js"></script>
    <script>Jam.Medallion.insert({username: "..."})</script>

You can pass several options to Jam.Medallion.insert:

- text: Set to false to stop showing the 'My current jam is:' tag.
- image: Set to false to stop showing the jam avatar.
- imageSize: "small" (default), "medium" or "large".

Markup
------

The generated markup will look something like this:

<div class="jam-medallion">
  <a class="jam-image" href="...">
    <img class="jam-jamvatar" src="...">
  </a>

  <p class="jam-text">
    My current jam is <a href="...">...</a>.
  </p>
</div>

A "jam-loading" class is added to the outer div while the jam data is being
loaded from the API, so that you can style it appropriately.
