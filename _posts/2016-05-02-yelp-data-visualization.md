---
title: "Visualizing Yelp Data"
layout: post
---

This visualization was created as an assignment for CSE 512. The tree is sorted vertically by total review count. Leaves are colored according to star rating (very green to less green based on d3 category20c colors) binned in increments of 1. To no surprise, Vegas had significantly more reviews than the other cities!

Every layer of the tree structure is sorted by total review count. This makes it fun to see, comparatively, what sorts of places are the most popular in a given city (Businesses, general vibes, and types of venues)!

{% include yelp.html %}
