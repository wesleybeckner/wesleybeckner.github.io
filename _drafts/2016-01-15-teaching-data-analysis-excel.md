---
title: "Analysis of large datasets in Excel"
layout: page
---


#Working with large data files in Excel
http://nirfriedmanlab.blogspot.com/2011/01/growing-yeasts-robotically.html

*"Whenever you create a computer document, you should do so with the philosophy that if you open it again six months from now, you will immediately understand what you’re looking at."*

###Today we are analyzing OD<sub>600</sub> data of a yeast culture

what we know about yeast: 

they like to grow at 30 C and to be shaken and cells divide every 90-120 min (doubling time)

*phase 1*: lag phase 

*phase 2*: exponential phase or log phase (anaerobic) consuming glucose

*diauxic shift*: transition from phase 2 to 3

*phase 3*: saturated or early stationary phase (aerobic) consuming ethanol

http://www.kdnuggets.com/2015/04/baby-boom-udemy-excel-tutorial-analyzing-large-data-sets.html

Add a Metadata Block
--------------------

Our system uses special [YAML] front-matter blocks to store metadata
about each lesson. Use the following example to create a YAML block for
your lesson. This should appear at the very top of your lesson file.
(Note: you will not know the names of your reviewers. Leave this blank
for now.)

    ---
    title: Data Mining the Internet Archive Collection
    authors:
    - Caleb McDaniel
    date: 2014-03-03
    reviewers:
    - William J. Turkel
    layout: default
    ---

```

    #http://docs.scipy.org/doc/numpy/reference/arrays.indexing.html
    #http://docs.scipy.org/doc/numpy-1.10.1/reference/generated/numpy.random.normal.html
    
    import subprocess
    import csv
    import random
    import math as mt
    import numpy as np
    import matplotlib.pylab as plt
    %matplotlib inline
    
    def numpy_random(n):
        """Return a list of n random floats in the range [0, 1)."""
        return np.random.random((n)).tolist()
     
    def numpy_randint(a, b, n):
        """Return a list of n random ints in the range [a, b]."""
        return np.random.randint(a, b, n).tolist()
    
    def numpy_gauss(a, b, c):
        """Return a list of gaussian distributed ints centered at a, with std b, and size c"""
        return np.random.normal(a, b, c).tolist()


    #create an array of random numbers
    #growth curve formula y(t) = a * exp(-b(exp(-ct)))
    #a is an asymptote
    #b,c are positive
    #b translates the graph to the left or right
    #c sets the growth rate (y scaling)
    
    
    ###shuffled array of narnians
    f = 'peter'
    g = 'lucy'
    h = 'edmond'
    i = 'susan'
    b = []
    for k in range(3000):
        b.append(f)
        b.append(g)
        b.append(h)
        b.append(i)
        k + 4
    random.shuffle(b)
    
    ###shuffled array of temperature probes
    
    
    ###growth curves
    t = np.arange(1,31,0.01)
    a1 = 1
    b1 = -8
    c1 = 0.2
    c2 = 0.3
    c3 = 0.4
    y1 = a1 * np.exp(b1*np.exp(-c1*t))
    y2 = a1 * np.exp(b1*np.exp(-c2*t))
    y3 = a1 * np.exp(b1*np.exp(-c3*t))
    
    
    ###throw a rock at the growth curves
    r1 = numpy_random(3000)
    r2 = numpy_randint(90, 100, 3000)
    r2 = [x * 0.01 for x in r2]
    
    y1 = y1 * r1
    y2 = y2 * r2
    
    w = []
    x = []
    y = []
    z = []
    wx = []
    xx = []
    yx = []
    zx = []
    final = np.zeros((3000,2), dtype=object)
    
    for k in range(3000):
        if b[k] == 'peter':
            y3[k] = y3[k]
            final[k,1] = ['peter']
            final[k,0] = y3[k]
            w.append(y3[k])
            wx.append(k)
        elif b[k] == 'lucy':
            y3[k] = y3[k] + 0.01
            final[k,1] = ['lucy']
            final[k,0] = y3[k]
            x.append(y3[k])
            xx.append(k)
        elif b[k] == 'edmond':
            y3[k] = y3[k] * np.random.randint(94, 105, 1)*0.01
            final[k,1] = ['edmond']
            final[k,0] = y3[k]
            y.append(y3[k])
            yx.append(k)
        elif b[k] == 'susan':
            y3[k] = y3[k] * np.random.randint(94, 99, 1)*0.01
            final[k,1] = ['susan']
            final[k,0] = y3[k]
            z.append(y3[k])
            zx.append(k)
        
    ###plot that stuff
    fig = plt.figure(figsize=(18,18))
    plt1 = fig.add_subplot(211)
    plt1.plot(wx, w)
    plt1.plot(xx, x)
    plt1.plot(yx, y)
    plt1.plot(zx, z)
    plt2 = fig.add_subplot(212)
    plt2.plot(y3)
    
    
    with open('curious_data.csv', 'wb') as csvfile:
        spamwriter = csv.writer(csvfile, delimiter='\n',
                                 quoting=csv.QUOTE_MINIMAL)
        spamwriter.writerow(final)



![]({{ site.url }}/assets/output_2_0.png)



    #a = np.array[[],[]]
    a = numpy_random(3000)
    b = numpy_randint(-5, 5, 3000)
    c = np.arange(3000)
    c = c + 1
    b = b+c
    b = b*c
    d = [c,a,b]


    fig = plt.figure(figsize=(18,12))
    ax1 = fig.add_subplot(131)
    ax1.plot(a)
    ax2 = fig.add_subplot(132)
    ax2.plot(b)
    ax3 = fig.add_subplot(133)
    ax3.plot(a, b)
    
    plt.show




    <function matplotlib.pyplot.show>




![]({{ site.url }}/assets/output_4_1.png)



    np.savetxt("foo.csv", d, delimiter=",")


    #a = np.array[[],[]]
    e = numpy_random(3000)
    f = numpy_randint(-5, 5, 3000)
    g = np.arange(3000)
    h = numpy_gauss(300, 3, 3000)


    fig = plt.figure(figsize=(18,12))
    ax1 = fig.add_subplot(131)
    ax1.plot(e)
    ax2 = fig.add_subplot(132)
    ax2.plot(g)
    ax3 = fig.add_subplot(133)
    ax3.plot(h)
    
    plt.show




    <function matplotlib.pyplot.show>




![]({{ site.url }}/assets/output_7_1.png)



    count, bins, ignored = plt.hist(h, 30, normed=True)
    plt.plot(bins, 1/(3 * np.sqrt(2*np.pi)) * np.exp(-(bins-300)**2 / (2*3**2)))
    plt.show




    <function matplotlib.pyplot.show>




![]({{ site.url }}/assets/output_8_1.png)


```
    


    
