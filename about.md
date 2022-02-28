---
layout: inner
title: About
permalink: /about/
---

## About Me

![Me](../img/posts/wesley_2022.jpg)

### Definition lists can be used with HTML syntax.

<dl>
<dt>Name</dt>
<dd>Godzilla</dd>
<dt>Born</dt>
<dd>1952</dd>
<dt>Birthplace</dt>
<dd>Japan</dd>
<dt>Color</dt>
<dd>Green</dd>
</dl>

{% highlight txt %}
Long, single-line code blocks should not wrap. They should horizontally scroll if they are too long. This line should be long enough to demonstrate this.
{% endhighlight %}

{% highlight txt %}
The final element.
{% endhighlight %}

---

## Syntax highlighting

Jekyll has [built in support](https://jekyllrb.com/docs/templates/#code-snippet-highlighting) for syntax highlighting of over 60 languages thanks to [Rouge](http://rouge.jneen.net/).

To render a code block with syntax highlighting, surround your code as follows:

{% highlight markdown %}
{% raw %}
{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}
{% endraw %}
{% endhighlight %}

[Pygments](http://pygments.org/) styles are present under section 6.0 of `css/style.scss` for customization.

### Examples

---

#### Bash

{% highlight bash %}
>_ ssh -i ~/.ssh/id_rsa account@host.com
account@host:~$
$ var="my-value"
$ echo $var
my-value
$ logout
{% endhighlight %}

#### HTML

{% highlight html %}
<!DOCTYPE html>
<html>
 <head>
   <meta charset="UTF-8">
   <title>title</title>
 </head>
 <body>

 </body>
</html>
{% endhighlight %}

#### CSS

{% highlight css %}
/*--------------------------------------------------------------
	1.0 Defaults
--------------------------------------------------------------*/

@media (min-width: 1200px) {
  .container {
    width: 1200px;
  }
}

body {
  background-color: #e9edf0;
  @extend %opensans;
  -webkit-font-smoothing: antialiased;
}
{% endhighlight %}

#### YAML

{% highlight yaml %}
### Phantom settings
paginate: 10
footer_text: '© 2018 Jami Gibbs'
admin_name: 'Jami Gibbs'
google_analytics: "UA-9999999-99" # Update with your own tracking ID

#### Phantom Navigation menu
enable_nav: true
nav_item:
  - { url: '/', text: 'Home' }
  - { url: '/about', text: 'About' }
{% endhighlight %}
