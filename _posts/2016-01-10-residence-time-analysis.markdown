---
layout: post
title: "Surface Hydration Working Programs"
date: 2016-01-10 17:30:37
categories: research
---
#Surface Analysis

#Hydration Analysis of 70% of maximum packing density SAMs

###Working Programs


    master_set1 = [[],[],[],[],[],[]]
    
    #setup
    %matplotlib inline
    import numpy as np
    import MDAnalysis as md
    import matplotlib.pylab as plt
    import pandas
    #curve fitting setup
    from lmfit import Model    
    def decay(t, A, tau):
        return A*np.exp(-t/tau)
    def myround(x, base):
        return (float(base) * round(float(x)/float(base)))
    
    for runnumber in range(1,7):
        data = pandas.read_csv('%s_2to5ns_50headgroups' % runnumber, header=None, names=['time', \
        'dx', 'dy', 'dz'])
        tcom = data[['time']].values
        xcom = data['dx'].values
        ycom = data['dy'].values
        zcom = data['dz'].values
        start = np.mean(zcom)
        start = myround(start, 0.25) #to match density plots
        start = start*10 #convert to angstroms
        
        #begin analysis centered around COM of headgroups (2 angstrom slices)
        l1 = start -1
    
        PDB = "50.pdb"
        XTC = "set1_%s_50.xtc" % runnumber # Enter filename for trajectory
        u = md.Universe(PDB, XTC)
        SOL = u.selectAtoms("resname SOL")
        tauvalues = []
    
        for layer in range(0,40): #Increment up to 10 A from surface
            tauvalues.append(layer) #layer=0 in first iteration, we then increment by 0.25 
            currentlayer = l1 + 0.25 * layer #angstroms.layers are in 0.25 angstrom slices 
            nextlayer = currentlayer + 2 #(we're moving a 2 A window in 0.25 A steps in Z)
            currentlayer = str('%.4g' % currentlayer)
            nextlayer = str('%.4g' % nextlayer)
            print "prop z >= %s and prop z <= %s" % (currentlayer, nextlayer)
    
            timeslice = ['Ct', 'Dt', 'Et', 'Ft', 'Gt', 'Ht', 'It', 'Jt', 'Kt', 'Lt', 'Mt']
            n = ['Cn', 'Dn', 'En', 'Fn', 'Gn', 'Hn', 'In', 'Jn', 'Kn', 'Ln']
            Cty = 0
    
            for i in range(10):
                j = i * 100 +2000 #shift analysis to start at 2 ns. Time slices are in 100 ps 
                k = j + 40 #increments, and we read from 0-100ps to 900-1000ps
                for ts in u.trajectory[j:(j+1)]: #read the trajectory for 1 ps
                    slice0 = SOL.selectAtoms("prop z >= %s and prop z <= %s" % (currentlayer, \
                    nextlayer)).residues.resids()
                n[i] = len(slice0) #n stores the total number of initial waters found
                init_res = []
                for x in slice0:
                    init_res.append(x) #append the initial resids to init_res
                
                         
                timeslice[i] = []
                for t in u.trajectory[j:k]: #read the trajectory incrementally in the current time 
                    p = 0.25                #window (100 ps)
                    reslist = SOL.selectAtoms("prop z >= %s and prop z <= %s" % (currentlayer, \
                    nextlayer)).residues.resids()
                    for x in init_res:
                        if x in reslist:
                            p+=1
                        else:
                            init_res.remove(x) #if the resid is not found, remove it from init_res
                    timeslice[i].append((u.trajectory.time, p))
                timeslice[i] = np.array(timeslice[i]) #make timeslice[] an array containing the time 
                                                      #stamp (100ps window) and number of waters 
                Cty = (timeslice[i][:,1]/n[i]) + Cty  #present (p)
                                                      #Cty is incorrect after the initial value 
                                                      #of i until it is divided by 10 later in the 
                                                      #code. It is every ps window divided by the 
            Cty = Cty/10                              #original # of waters for that window (n[]). 
            #fig = plt.figure(figsize=(12,8))         #Essentially  it is timslice[] with fraction 
                                                      #remaining waters instead of #of waters. 
            #axes = fig.add_subplot(111)              #     def decay(t, A, tau):
            #axes.plot(timeslice[0][:,0], Cty, 'r-')  #     return A*np.exp(-t/tau)
            #plt.ylabel('Autocorrelation')            #we want to solve for A and tau that gives the  
            #plt.xlabel('Time (ps)')         #the exponential decay of waters in the timeslices
            #plt.grid(True)                  #http://mx.nthu.edu.tw/~cchu/course/acrk/chapter7.pdf
            #plt.xlim(0,100)                 #res time fitting to an exponential decay is common
            #plt.show()                      #our model here mimics that of a CSTR E(t)=A*e^(-t/tau)
    
            #print Cty
            
            model = Model(decay, independent_vars=['t'])
            result = model.fit(Cty, t=np.array(range(1,41)), A=1, tau=80)
            print result.values
            temp = result.values
            tauvalues[layer] = temp['tau']
            temp = 0
        
        accessmaster = runnumber - 1
        master_set1[accessmaster] = tauvalues

    prop z >= 14 and prop z <= 16
    {'A': 1.1756641887685839, 'tau': 3.4405645862452348}
    prop z >= 14.25 and prop z <= 16.25
    {'A': 1.2071413060004701, 'tau': 3.456339304147328}
    prop z >= 14.5 and prop z <= 16.5
    {'A': 1.2163744833696268, 'tau': 3.3675667213917917}
    prop z >= 14.75 and prop z <= 16.75
    {'A': 1.2243101325739361, 'tau': 3.300559303781879}
    prop z >= 15 and prop z <= 17
    {'A': 1.2227448779293257, 'tau': 3.3342496449659516}
    prop z >= 15.25 and prop z <= 17.25
    {'A': 1.2286246274802306, 'tau': 3.2707674734869769}
    prop z >= 15.5 and prop z <= 17.5
    {'A': 1.216592612911366, 'tau': 3.2934946585136999}
    prop z >= 15.75 and prop z <= 17.75
    {'A': 1.218101702091438, 'tau': 3.3510727431663287}
    prop z >= 16 and prop z <= 18
    {'A': 1.2269194086547865, 'tau': 3.3372963557656368}
    prop z >= 16.25 and prop z <= 18.25
    {'A': 1.216159057080868, 'tau': 3.4087296541941989}
    prop z >= 16.5 and prop z <= 18.5
    {'A': 1.2118932047651998, 'tau': 3.4386309013664795}
    prop z >= 16.75 and prop z <= 18.75
    {'A': 1.2108962045111173, 'tau': 3.4473242162956219}
    prop z >= 17 and prop z <= 19
    {'A': 1.2008822513432518, 'tau': 3.5266670284125134}
    prop z >= 17.25 and prop z <= 19.25
    {'A': 1.1855031337132229, 'tau': 3.6404866606252209}
    prop z >= 17.5 and prop z <= 19.5
    {'A': 1.1859542148309985, 'tau': 3.6139281505452643}
    prop z >= 17.75 and prop z <= 19.75
    {'A': 1.1839457440353705, 'tau': 3.5960311866140851}
    prop z >= 18 and prop z <= 20
    {'A': 1.2040366109376124, 'tau': 3.5281511304288773}
    prop z >= 18.25 and prop z <= 20.25
    {'A': 1.2216867836225713, 'tau': 3.3544968025645621}
    prop z >= 18.5 and prop z <= 20.5
    {'A': 1.233775991651118, 'tau': 3.2529837398928438}
    prop z >= 18.75 and prop z <= 20.75
    {'A': 1.2502942005172124, 'tau': 3.1407202787873261}
    prop z >= 19 and prop z <= 21
    {'A': 1.2806656166017043, 'tau': 2.9710715439555493}
    prop z >= 19.25 and prop z <= 21.25
    {'A': 1.3053067941118905, 'tau': 2.8457713488818164}
    prop z >= 19.5 and prop z <= 21.5
    {'A': 1.3157605973517201, 'tau': 2.8049879581621169}
    prop z >= 19.75 and prop z <= 21.75
    {'A': 1.3188965230063774, 'tau': 2.7737493027919018}
    prop z >= 20 and prop z <= 22
    {'A': 1.3314229480390001, 'tau': 2.7096012833723857}
    prop z >= 20.25 and prop z <= 22.25
    {'A': 1.3312654816952088, 'tau': 2.7173921029050594}
    prop z >= 20.5 and prop z <= 22.5
    {'A': 1.3244209385577308, 'tau': 2.7327888840710655}
    prop z >= 20.75 and prop z <= 22.75
    {'A': 1.3292208398571919, 'tau': 2.7366964101765876}
    prop z >= 21 and prop z <= 23
    {'A': 1.3323031962122969, 'tau': 2.7310912075074798}
    prop z >= 21.25 and prop z <= 23.25
    {'A': 1.3292557072503539, 'tau': 2.7324176456126064}
    prop z >= 21.5 and prop z <= 23.5
    {'A': 1.3511697229701325, 'tau': 2.6210711707033565}
    prop z >= 21.75 and prop z <= 23.75
    {'A': 1.35975888267278, 'tau': 2.6003733091863905}
    prop z >= 22 and prop z <= 24
    {'A': 1.3520361813912523, 'tau': 2.6378106656064615}
    prop z >= 22.25 and prop z <= 24.25
    {'A': 1.377723701583764, 'tau': 2.5673596974289343}
    prop z >= 22.5 and prop z <= 24.5
    {'A': 1.3602492518646003, 'tau': 2.6157570135232024}
    prop z >= 22.75 and prop z <= 24.75
    {'A': 1.3679845353153461, 'tau': 2.5886528117273824}
    prop z >= 23 and prop z <= 25
    {'A': 1.3597003021737737, 'tau': 2.6043769301274433}
    prop z >= 23.25 and prop z <= 25.25
    {'A': 1.3620865731420353, 'tau': 2.6185817997177745}
    prop z >= 23.5 and prop z <= 25.5
    {'A': 1.3656042649516342, 'tau': 2.608758549077653}
    prop z >= 23.75 and prop z <= 25.75
    {'A': 1.3684352534876794, 'tau': 2.5962702055387172}
    prop z >= 11.5 and prop z <= 13.5
    {'A': 0.98581367281923749, 'tau': 5.4824942473816254}
    prop z >= 11.75 and prop z <= 13.75
    {'A': 1.0711793861562762, 'tau': 4.8101386140418585}
    prop z >= 12 and prop z <= 14
    {'A': 1.1291531213951702, 'tau': 4.1426365750705845}
    prop z >= 12.25 and prop z <= 14.25
    {'A': 1.149668264072131, 'tau': 3.8634979777605096}
    prop z >= 12.5 and prop z <= 14.5
    {'A': 1.1400100871945931, 'tau': 3.9354802037844565}
    prop z >= 12.75 and prop z <= 14.75
    {'A': 1.1358861753826426, 'tau': 3.9531930126033519}
    prop z >= 13 and prop z <= 15
    {'A': 1.1267053628608856, 'tau': 4.0069715947731011}
    prop z >= 13.25 and prop z <= 15.25
    {'A': 1.1379967520436465, 'tau': 3.9921978665887883}
    prop z >= 13.5 and prop z <= 15.5
    {'A': 1.149262660790012, 'tau': 4.0834672323729349}
    prop z >= 13.75 and prop z <= 15.75
    {'A': 1.1652582758298144, 'tau': 3.9792354463533406}
    prop z >= 14 and prop z <= 16
    {'A': 1.1640303191251604, 'tau': 3.8762664603688757}
    prop z >= 14.25 and prop z <= 16.25
    {'A': 1.1756191181709368, 'tau': 3.7152211427624913}
    prop z >= 14.5 and prop z <= 16.5
    {'A': 1.1750812015700431, 'tau': 3.6759378396156661}
    prop z >= 14.75 and prop z <= 16.75
    {'A': 1.1786277906352685, 'tau': 3.6217393892543193}
    prop z >= 15 and prop z <= 17
    {'A': 1.1842476193439906, 'tau': 3.5957049514446409}
    prop z >= 15.25 and prop z <= 17.25
    {'A': 1.1988620629604403, 'tau': 3.5413792683799041}
    prop z >= 15.5 and prop z <= 17.5
    {'A': 1.2046299012528086, 'tau': 3.4559006194504662}
    prop z >= 15.75 and prop z <= 17.75
    {'A': 1.1936164719984252, 'tau': 3.5298887402864687}
    prop z >= 16 and prop z <= 18
    {'A': 1.1969640393892296, 'tau': 3.555490898026799}
    prop z >= 16.25 and prop z <= 18.25
    {'A': 1.2100655831151796, 'tau': 3.4740533240202036}
    prop z >= 16.5 and prop z <= 18.5
    {'A': 1.2072617923186875, 'tau': 3.5031411002168289}
    prop z >= 16.75 and prop z <= 18.75
    {'A': 1.2096186604422778, 'tau': 3.4931862545727772}
    prop z >= 17 and prop z <= 19
    {'A': 1.208546499349356, 'tau': 3.4695732106847514}
    prop z >= 17.25 and prop z <= 19.25
    {'A': 1.2097796776897012, 'tau': 3.4363407343119898}
    prop z >= 17.5 and prop z <= 19.5
    {'A': 1.2257455733182507, 'tau': 3.3394435547133163}
    prop z >= 17.75 and prop z <= 19.75
    {'A': 1.2333412236415409, 'tau': 3.2933350089559097}
    prop z >= 18 and prop z <= 20
    {'A': 1.2350853271099311, 'tau': 3.2716245814762432}
    prop z >= 18.25 and prop z <= 20.25
    {'A': 1.254121184926525, 'tau': 3.1436847736180389}
    prop z >= 18.5 and prop z <= 20.5
    {'A': 1.2630251955675476, 'tau': 3.0623339309838196}
    prop z >= 18.75 and prop z <= 20.75
    {'A': 1.2784182508460322, 'tau': 3.0014123271661624}
    prop z >= 19 and prop z <= 21
    {'A': 1.3090454154694671, 'tau': 2.851367543705905}
    prop z >= 19.25 and prop z <= 21.25
    {'A': 1.3185310956113523, 'tau': 2.8118712255071427}
    prop z >= 19.5 and prop z <= 21.5
    {'A': 1.3099049849487601, 'tau': 2.8200860852337444}
    prop z >= 19.75 and prop z <= 21.75
    {'A': 1.3305330859583948, 'tau': 2.7624440965142489}
    prop z >= 20 and prop z <= 22
    {'A': 1.3303881596941201, 'tau': 2.7675210287660637}
    prop z >= 20.25 and prop z <= 22.25
    {'A': 1.3338271113237787, 'tau': 2.7243570280859926}
    prop z >= 20.5 and prop z <= 22.5
    {'A': 1.3325621413892472, 'tau': 2.7260277285605961}
    prop z >= 20.75 and prop z <= 22.75
    {'A': 1.3197610300278697, 'tau': 2.7746246739899094}
    prop z >= 21 and prop z <= 23
    {'A': 1.3349368819497689, 'tau': 2.7256752687455363}
    prop z >= 21.25 and prop z <= 23.25
    {'A': 1.3443401506193655, 'tau': 2.709865520627154}
    prop z >= 9 and prop z <= 11
    {'A': 0.91311872096109115, 'tau': 6.5321747749552772}
    prop z >= 9.25 and prop z <= 11.25
    {'A': 0.95894565028062395, 'tau': 6.7977607301362868}
    prop z >= 9.5 and prop z <= 11.5
    {'A': 0.99429601725595829, 'tau': 6.4632660061163172}
    prop z >= 9.75 and prop z <= 11.75
    {'A': 1.0131519653479029, 'tau': 6.0490948454105569}
    prop z >= 10 and prop z <= 12
    {'A': 1.0009211205543778, 'tau': 6.1534827284930254}
    prop z >= 10.25 and prop z <= 12.25
    {'A': 0.97611552332629414, 'tau': 6.5100095564301945}
    prop z >= 10.5 and prop z <= 12.5
    {'A': 0.97483409476923055, 'tau': 6.7343217087054352}
    prop z >= 10.75 and prop z <= 12.75
    {'A': 0.98506508816684457, 'tau': 6.5154513257213296}
    prop z >= 11 and prop z <= 13
    {'A': 0.99787694063367027, 'tau': 6.1663333816209756}
    prop z >= 11.25 and prop z <= 13.25
    {'A': 1.021720129274555, 'tau': 5.7144288270659205}
    prop z >= 11.5 and prop z <= 13.5
    {'A': 1.0465641601567857, 'tau': 5.0948662788042336}
    prop z >= 11.75 and prop z <= 13.75
    {'A': 1.1134265448204808, 'tau': 4.2997573576710968}
    prop z >= 12 and prop z <= 14
    {'A': 1.1315702799384264, 'tau': 4.096640777170891}
    prop z >= 12.25 and prop z <= 14.25
    {'A': 1.1331158159642498, 'tau': 4.0456180315478631}
    prop z >= 12.5 and prop z <= 14.5
    {'A': 1.132315922092944, 'tau': 4.0459157689226855}
    prop z >= 12.75 and prop z <= 14.75
    {'A': 1.1398100836232772, 'tau': 4.0198618015970311}
    prop z >= 13 and prop z <= 15
    {'A': 1.154722720500815, 'tau': 3.8708855227534942}
    prop z >= 13.25 and prop z <= 15.25
    {'A': 1.155290406491251, 'tau': 3.8844286863770292}
    prop z >= 13.5 and prop z <= 15.5
    {'A': 1.1721733939974777, 'tau': 3.7470808443476034}
    prop z >= 13.75 and prop z <= 15.75
    {'A': 1.17618480145948, 'tau': 3.6836667799842608}
    prop z >= 14 and prop z <= 16
    {'A': 1.2007299835251095, 'tau': 3.5419256195257676}
    prop z >= 14.25 and prop z <= 16.25
    {'A': 1.2168732488835958, 'tau': 3.3916224188522035}
    prop z >= 14.5 and prop z <= 16.5
    {'A': 1.2336184126421652, 'tau': 3.3154052690002449}
    prop z >= 14.75 and prop z <= 16.75
    {'A': 1.2406678453346716, 'tau': 3.2669050577156096}
    prop z >= 15 and prop z <= 17
    {'A': 1.2423308349181819, 'tau': 3.2188274725045889}
    prop z >= 15.25 and prop z <= 17.25
    {'A': 1.2554451757719614, 'tau': 3.1684645101299185}
    prop z >= 15.5 and prop z <= 17.5
    {'A': 1.2552587588257604, 'tau': 3.1406125300159498}
    prop z >= 15.75 and prop z <= 17.75
    {'A': 1.2429631291351293, 'tau': 3.202032331350066}
    prop z >= 16 and prop z <= 18
    {'A': 1.2517495575405537, 'tau': 3.145444998097056}
    prop z >= 16.25 and prop z <= 18.25
    {'A': 1.277085082296606, 'tau': 3.0155568705667641}
    prop z >= 16.5 and prop z <= 18.5
    {'A': 1.2756168352557706, 'tau': 3.0306290470242097}
    prop z >= 16.75 and prop z <= 18.75
    {'A': 1.2841265210778323, 'tau': 2.9873561216718563}
    prop z >= 17 and prop z <= 19
    {'A': 1.2807945558153748, 'tau': 2.9944579403500473}
    prop z >= 17.25 and prop z <= 19.25
    {'A': 1.2580591468842126, 'tau': 3.1000832768704316}
    prop z >= 17.5 and prop z <= 19.5
    {'A': 1.284318251942681, 'tau': 2.9665940368743744}
    prop z >= 17.75 and prop z <= 19.75
    {'A': 1.3073930185746947, 'tau': 2.8684610226628653}
    prop z >= 18 and prop z <= 20
    {'A': 1.3112313776029429, 'tau': 2.8247576073407461}
    prop z >= 18.25 and prop z <= 20.25
    {'A': 1.3323021776749315, 'tau': 2.7519336320260637}
    prop z >= 18.5 and prop z <= 20.5
    {'A': 1.3447636295195482, 'tau': 2.6889100586380277}
    prop z >= 18.75 and prop z <= 20.75
    {'A': 1.3373514891570357, 'tau': 2.7070350021013514}
    prop z >= 9 and prop z <= 11
    {'A': 1.0116654646074237, 'tau': 5.0075624457714678}
    prop z >= 9.25 and prop z <= 11.25
    {'A': 1.0211732710814387, 'tau': 5.5404647064776915}
    prop z >= 9.5 and prop z <= 11.5
    {'A': 1.0303974700263627, 'tau': 5.4366501117552239}
    prop z >= 9.75 and prop z <= 11.75
    {'A': 1.0452176216223235, 'tau': 5.2161226386121822}
    prop z >= 10 and prop z <= 12
    {'A': 1.0455930302902274, 'tau': 5.2018451383161324}
    prop z >= 10.25 and prop z <= 12.25
    {'A': 1.0651865544707537, 'tau': 4.8521389421601393}
    prop z >= 10.5 and prop z <= 12.5
    {'A': 1.0801690917838667, 'tau': 4.596188587019725}
    prop z >= 10.75 and prop z <= 12.75
    {'A': 1.1049630349371038, 'tau': 4.3661287695314899}
    prop z >= 11 and prop z <= 13
    {'A': 1.1032191830177891, 'tau': 4.3676381127886517}
    prop z >= 11.25 and prop z <= 13.25
    {'A': 1.1150410254473568, 'tau': 4.2239571309411161}
    prop z >= 11.5 and prop z <= 13.5
    {'A': 1.1462644176210304, 'tau': 3.8970888884721884}
    prop z >= 11.75 and prop z <= 13.75
    {'A': 1.1547963010851736, 'tau': 3.7875423020486583}
    prop z >= 12 and prop z <= 14
    {'A': 1.1615548523522961, 'tau': 3.7794770484211306}
    prop z >= 12.25 and prop z <= 14.25
    {'A': 1.1730920986972564, 'tau': 3.6799005787995998}
    prop z >= 12.5 and prop z <= 14.5
    {'A': 1.1606290164094835, 'tau': 3.7856042956514138}
    prop z >= 12.75 and prop z <= 14.75
    {'A': 1.1748647364782747, 'tau': 3.7205882572044975}
    prop z >= 13 and prop z <= 15
    {'A': 1.1801660969128835, 'tau': 3.7234779948464056}
    prop z >= 13.25 and prop z <= 15.25
    {'A': 1.1908718766095414, 'tau': 3.6252893903432515}
    prop z >= 13.5 and prop z <= 15.5
    {'A': 1.1940925879293118, 'tau': 3.6204861796961723}
    prop z >= 13.75 and prop z <= 15.75
    {'A': 1.1890023959848028, 'tau': 3.5945437896381947}
    prop z >= 14 and prop z <= 16
    {'A': 1.2000295384840398, 'tau': 3.487593088070462}
    prop z >= 14.25 and prop z <= 16.25
    {'A': 1.2080086968173511, 'tau': 3.4367767684491688}
    prop z >= 14.5 and prop z <= 16.5
    {'A': 1.2044686401962137, 'tau': 3.4463210314673161}
    prop z >= 14.75 and prop z <= 16.75
    {'A': 1.2186485674685583, 'tau': 3.347655695398593}
    prop z >= 15 and prop z <= 17
    {'A': 1.2306912374862182, 'tau': 3.271827379624725}
    prop z >= 15.25 and prop z <= 17.25
    {'A': 1.2567694472307769, 'tau': 3.1112853862690639}
    prop z >= 15.5 and prop z <= 17.5
    {'A': 1.2793000088571034, 'tau': 2.9944406321364765}
    prop z >= 15.75 and prop z <= 17.75
    {'A': 1.2721153802300647, 'tau': 3.0465903906961005}
    prop z >= 16 and prop z <= 18
    {'A': 1.2811403201347278, 'tau': 2.9940070989980576}
    prop z >= 16.25 and prop z <= 18.25
    {'A': 1.3060980779395057, 'tau': 2.8930210293888212}
    prop z >= 16.5 and prop z <= 18.5
    {'A': 1.2974726096171971, 'tau': 2.9254000656836765}
    prop z >= 16.75 and prop z <= 18.75
    {'A': 1.3062192192410786, 'tau': 2.8712318314230569}
    prop z >= 17 and prop z <= 19
    {'A': 1.3128150715801465, 'tau': 2.8499745962203558}
    prop z >= 17.25 and prop z <= 19.25
    {'A': 1.3262385476467577, 'tau': 2.7937661835098302}
    prop z >= 17.5 and prop z <= 19.5
    {'A': 1.3328179286611144, 'tau': 2.7598981100346109}
    prop z >= 17.75 and prop z <= 19.75
    {'A': 1.3293469432369576, 'tau': 2.7565121168001174}
    prop z >= 18 and prop z <= 20
    {'A': 1.3329373600793459, 'tau': 2.7269893599408603}
    prop z >= 18.25 and prop z <= 20.25
    {'A': 1.3456504663226927, 'tau': 2.665240430077525}
    prop z >= 18.5 and prop z <= 20.5
    {'A': 1.360875440379953, 'tau': 2.6182504829428015}
    prop z >= 18.75 and prop z <= 20.75
    {'A': 1.3541850781858746, 'tau': 2.6597099980779828}
    prop z >= 9 and prop z <= 11
    {'A': 1.020454611293321, 'tau': 4.9155176210692089}
    prop z >= 9.25 and prop z <= 11.25
    {'A': 1.0313806316322647, 'tau': 5.2939652608201806}
    prop z >= 9.5 and prop z <= 11.5
    {'A': 1.0663437972772054, 'tau': 4.9305619491023513}
    prop z >= 9.75 and prop z <= 11.75
    {'A': 1.0798834601191225, 'tau': 4.7642316119354584}
    prop z >= 10 and prop z <= 12
    {'A': 1.1008156875528616, 'tau': 4.499848745985048}
    prop z >= 10.25 and prop z <= 12.25
    {'A': 1.1135475559672876, 'tau': 4.3715261497977389}
    prop z >= 10.5 and prop z <= 12.5
    {'A': 1.128517232316379, 'tau': 4.1474481028395997}
    prop z >= 10.75 and prop z <= 12.75
    {'A': 1.1467181898020531, 'tau': 3.9207870771014024}
    prop z >= 11 and prop z <= 13
    {'A': 1.1451067190278317, 'tau': 3.9006737177194668}
    prop z >= 11.25 and prop z <= 13.25
    {'A': 1.1588638219909888, 'tau': 3.7958508202690004}
    prop z >= 11.5 and prop z <= 13.5
    {'A': 1.1683733600751232, 'tau': 3.6671485032985247}
    prop z >= 11.75 and prop z <= 13.75
    {'A': 1.1877193857061235, 'tau': 3.5535672590191636}
    prop z >= 12 and prop z <= 14
    {'A': 1.19991833768201, 'tau': 3.4747367295069163}
    prop z >= 12.25 and prop z <= 14.25
    {'A': 1.2227894118780958, 'tau': 3.3504957138901403}
    prop z >= 12.5 and prop z <= 14.5
    {'A': 1.2219110419438071, 'tau': 3.3687783667460631}
    prop z >= 12.75 and prop z <= 14.75
    {'A': 1.2153617911157533, 'tau': 3.3764112287945265}
    prop z >= 13 and prop z <= 15
    {'A': 1.2306485637811289, 'tau': 3.3136216158358809}
    prop z >= 13.25 and prop z <= 15.25
    {'A': 1.2230185350397245, 'tau': 3.3581541004803031}
    prop z >= 13.5 and prop z <= 15.5
    {'A': 1.2343252946753949, 'tau': 3.2698751065587035}
    prop z >= 13.75 and prop z <= 15.75
    {'A': 1.2423584817362752, 'tau': 3.2248421032399373}
    prop z >= 14 and prop z <= 16
    {'A': 1.2332456898926052, 'tau': 3.2617348406896056}
    prop z >= 14.25 and prop z <= 16.25
    {'A': 1.236174835508367, 'tau': 3.2236695357388476}
    prop z >= 14.5 and prop z <= 16.5
    {'A': 1.250778902965767, 'tau': 3.122212192431467}
    prop z >= 14.75 and prop z <= 16.75
    {'A': 1.2546983534272607, 'tau': 3.1149750399275278}
    prop z >= 15 and prop z <= 17
    {'A': 1.2840532980631092, 'tau': 3.000131267559909}
    prop z >= 15.25 and prop z <= 17.25
    {'A': 1.2904068143470457, 'tau': 2.974148416342512}
    prop z >= 15.5 and prop z <= 17.5
    {'A': 1.3093719833457262, 'tau': 2.9208105601200693}
    prop z >= 15.75 and prop z <= 17.75
    {'A': 1.2921654055765703, 'tau': 2.9354969758433227}
    prop z >= 16 and prop z <= 18
    {'A': 1.2939880619263331, 'tau': 2.9457858770525336}
    prop z >= 16.25 and prop z <= 18.25
    {'A': 1.2972807227896868, 'tau': 2.92261202988534}
    prop z >= 16.5 and prop z <= 18.5
    {'A': 1.3127020825215605, 'tau': 2.8733390591792713}
    prop z >= 16.75 and prop z <= 18.75
    {'A': 1.3233465276041136, 'tau': 2.8060645935368749}
    prop z >= 17 and prop z <= 19
    {'A': 1.3134475488011526, 'tau': 2.8461145127413605}
    prop z >= 17.25 and prop z <= 19.25
    {'A': 1.310081606900577, 'tau': 2.8685894746826586}
    prop z >= 17.5 and prop z <= 19.5
    {'A': 1.3226614219030155, 'tau': 2.8479680713947113}
    prop z >= 17.75 and prop z <= 19.75
    {'A': 1.3216548981404082, 'tau': 2.8312729584062408}
    prop z >= 18 and prop z <= 20
    {'A': 1.3128662803133171, 'tau': 2.8561854230183781}
    prop z >= 18.25 and prop z <= 20.25
    {'A': 1.3274072444794653, 'tau': 2.7881702487377407}
    prop z >= 18.5 and prop z <= 20.5
    {'A': 1.3463234471588814, 'tau': 2.6882315256980767}
    prop z >= 18.75 and prop z <= 20.75
    {'A': 1.3390689470362465, 'tau': 2.7351223407517584}
    prop z >= 11.5 and prop z <= 13.5
    {'A': 1.251905576307637, 'tau': 3.0607195824481392}
    prop z >= 11.75 and prop z <= 13.75
    {'A': 1.2315376667832372, 'tau': 3.3522938721313942}
    prop z >= 12 and prop z <= 14
    {'A': 1.2322590059729601, 'tau': 3.3347712218354846}
    prop z >= 12.25 and prop z <= 14.25
    {'A': 1.2351259102547465, 'tau': 3.2774865674038529}
    prop z >= 12.5 and prop z <= 14.5
    {'A': 1.2421441700739657, 'tau': 3.213483945384672}
    prop z >= 12.75 and prop z <= 14.75
    {'A': 1.2478594335902402, 'tau': 3.2050576978807634}
    prop z >= 13 and prop z <= 15
    {'A': 1.2571247285857425, 'tau': 3.1570823939160015}
    prop z >= 13.25 and prop z <= 15.25
    {'A': 1.2708155290865712, 'tau': 3.086400394829635}
    prop z >= 13.5 and prop z <= 15.5
    {'A': 1.2704451620446553, 'tau': 3.0567092935780913}
    prop z >= 13.75 and prop z <= 15.75
    {'A': 1.2726465263166782, 'tau': 3.0192941513963598}
    prop z >= 14 and prop z <= 16
    {'A': 1.2643398039567941, 'tau': 3.0322728856047259}
    prop z >= 14.25 and prop z <= 16.25
    {'A': 1.2856867668400329, 'tau': 2.9250545355093709}
    prop z >= 14.5 and prop z <= 16.5
    {'A': 1.2828701207869964, 'tau': 2.96066244470041}
    prop z >= 14.75 and prop z <= 16.75
    {'A': 1.3126263030087224, 'tau': 2.8384981230544484}
    prop z >= 15 and prop z <= 17
    {'A': 1.3197696046922489, 'tau': 2.8077260088022613}
    prop z >= 15.25 and prop z <= 17.25
    {'A': 1.3207704049441102, 'tau': 2.7997191011408615}
    prop z >= 15.5 and prop z <= 17.5
    {'A': 1.3324101698935304, 'tau': 2.7443498175676164}
    prop z >= 15.75 and prop z <= 17.75
    {'A': 1.3453348635423543, 'tau': 2.7159438492973034}
    prop z >= 16 and prop z <= 18
    {'A': 1.3272895035942809, 'tau': 2.7535691577001802}
    prop z >= 16.25 and prop z <= 18.25
    {'A': 1.3349174215284982, 'tau': 2.7249621235563128}
    prop z >= 16.5 and prop z <= 18.5
    {'A': 1.3474718874598206, 'tau': 2.6790004656204021}
    prop z >= 16.75 and prop z <= 18.75
    {'A': 1.3555831490927808, 'tau': 2.6490689050513696}
    prop z >= 17 and prop z <= 19
    {'A': 1.3509614652487125, 'tau': 2.6839227833623562}
    prop z >= 17.25 and prop z <= 19.25
    {'A': 1.3447161266346372, 'tau': 2.6993811260680016}
    prop z >= 17.5 and prop z <= 19.5
    {'A': 1.3421560324023678, 'tau': 2.6869817131144695}
    prop z >= 17.75 and prop z <= 19.75
    {'A': 1.3661042966139174, 'tau': 2.6077400711225169}
    prop z >= 18 and prop z <= 20
    {'A': 1.3664182325567147, 'tau': 2.6005359505351886}
    prop z >= 18.25 and prop z <= 20.25
    {'A': 1.3712706276496869, 'tau': 2.5937100312608541}
    prop z >= 18.5 and prop z <= 20.5
    {'A': 1.3513289202436292, 'tau': 2.657439697773015}
    prop z >= 18.75 and prop z <= 20.75
    {'A': 1.3684269065406702, 'tau': 2.6068666629784669}
    prop z >= 19 and prop z <= 21
    {'A': 1.3822786793429436, 'tau': 2.5736173016042407}
    prop z >= 19.25 and prop z <= 21.25
    {'A': 1.3739156981119534, 'tau': 2.5650236661503314}
    prop z >= 19.5 and prop z <= 21.5
    {'A': 1.3846777413730968, 'tau': 2.5247059967345526}
    prop z >= 19.75 and prop z <= 21.75
    {'A': 1.3888424987576757, 'tau': 2.508247793864061}
    prop z >= 20 and prop z <= 22
    {'A': 1.3898790206913347, 'tau': 2.5346755160301795}
    prop z >= 20.25 and prop z <= 22.25
    {'A': 1.3854934049087948, 'tau': 2.5505049953649395}
    prop z >= 20.5 and prop z <= 22.5
    {'A': 1.3810934767172891, 'tau': 2.584365873667124}
    prop z >= 20.75 and prop z <= 22.75
    {'A': 1.3728468451372033, 'tau': 2.6034235834990396}
    prop z >= 21 and prop z <= 23
    {'A': 1.3795709878200217, 'tau': 2.5927771552307171}
    prop z >= 21.25 and prop z <= 23.25
    {'A': 1.3637857146050005, 'tau': 2.6368947968065806}



    master_set2 = [[],[],[],[],[],[]]
    
    #setup
    %matplotlib inline
    import numpy as np
    import MDAnalysis as md
    import matplotlib.pylab as plt
    import pandas
    #curve fitting setup
    from lmfit import Model    
    def decay(t, A, tau):
        return A*np.exp(-t/tau)
    def myround(x, base):
        return (float(base) * round(float(x)/float(base)))
    
    for runnumber in range(1,7):
        data = pandas.read_csv('%s_2to5ns_50headgroups' % runnumber, header=None, names=['time', \
        'dx', 'dy', 'dz'])
        tcom = data[['time']].values
        xcom = data['dx'].values
        ycom = data['dy'].values
        zcom = data['dz'].values
        start = np.mean(zcom)
        start = myround(start, 0.25) #to match density plots
        start = start*10 #convert to angstroms
        
        #begin analysis centered around COM of headgroups (2 angstrom slices)
        l1 = start -1
    
        PDB = "50.pdb"
        XTC = "set2_%s_50.xtc" % runnumber # Enter filename for trajectory
        u = md.Universe(PDB, XTC)
        SOL = u.selectAtoms("resname SOL")
        tauvalues = []
    
        for layer in range(0,40): #Increment up to 10 A from surface
            tauvalues.append(layer) #layer=0 in first iteration, we then increment by 0.25 
            currentlayer = l1 + 0.25 * layer #angstroms.layers are in 0.25 angstrom slices 
            nextlayer = currentlayer + 2 #(we're moving a 2 A window in 0.25 A steps in Z)
            currentlayer = str('%.4g' % currentlayer)
            nextlayer = str('%.4g' % nextlayer)
            print "prop z >= %s and prop z <= %s" % (currentlayer, nextlayer)
    
            timeslice = ['Ct', 'Dt', 'Et', 'Ft', 'Gt', 'Ht', 'It', 'Jt', 'Kt', 'Lt', 'Mt']
            n = ['Cn', 'Dn', 'En', 'Fn', 'Gn', 'Hn', 'In', 'Jn', 'Kn', 'Ln']
            Cty = 0
    
            for i in range(10):
                j = i * 100 +2000 #shift analysis to start at 2 ns. Time slices are in 100 ps 
                k = j + 40 #increments, and we read from 0-100ps to 900-1000ps
                for ts in u.trajectory[j:(j+1)]: #read the trajectory for 1 ps
                    slice0 = SOL.selectAtoms("prop z >= %s and prop z <= %s" % (currentlayer, \
                    nextlayer)).residues.resids()
                n[i] = len(slice0) #n stores the total number of initial waters found
                init_res = []
                for x in slice0:
                    init_res.append(x) #append the initial resids to init_res
                
                         
                timeslice[i] = []
                for t in u.trajectory[j:k]: #read the trajectory incrementally in the current time 
                    p = 0.25                #window (100 ps)
                    reslist = SOL.selectAtoms("prop z >= %s and prop z <= %s" % (currentlayer, \
                    nextlayer)).residues.resids()
                    for x in init_res:
                        if x in reslist:
                            p+=1
                        else:
                            init_res.remove(x) #if the resid is not found, remove it from init_res
                    timeslice[i].append((u.trajectory.time, p))
                timeslice[i] = np.array(timeslice[i]) #make timeslice[] an array containing the time 
                                                      #stamp (100ps window) and number of waters 
                Cty = (timeslice[i][:,1]/n[i]) + Cty  #present (p)
                                                      #Cty is incorrect after the initial value 
                                                      #of i until it is divided by 10 later in the 
                                                      #code. It is every ps window divided by the 
            Cty = Cty/10                              #original # of waters for that window (n[]). 
            #fig = plt.figure(figsize=(12,8))         #Essentially  it is timslice[] with fraction 
                                                      #remaining waters instead of #of waters. 
            #axes = fig.add_subplot(111)              #     def decay(t, A, tau):
            #axes.plot(timeslice[0][:,0], Cty, 'r-')  #     return A*np.exp(-t/tau)
            #plt.ylabel('Autocorrelation')            #we want to solve for A and tau that gives the  
            #plt.xlabel('Time (ps)')         #the exponential decay of waters in the timeslices
            #plt.grid(True)                  #http://mx.nthu.edu.tw/~cchu/course/acrk/chapter7.pdf
            #plt.xlim(0,100)                 #res time fitting to an exponential decay is common
            #plt.show()                      #our model here mimics that of a CSTR E(t)=A*e^(-t/tau)
    
            #print Cty
            
            model = Model(decay, independent_vars=['t'])
            result = model.fit(Cty, t=np.array(range(1,41)), A=1, tau=80)
            print result.values
            temp = result.values
            tauvalues[layer] = temp['tau']
            temp = 0
        
        accessmaster = runnumber - 1
        master_set2[accessmaster] = tauvalues


    master_set3 = [[],[],[],[],[],[]]
    
    #setup
    %matplotlib inline
    import numpy as np
    import MDAnalysis as md
    import matplotlib.pylab as plt
    import pandas
    #curve fitting setup
    from lmfit import Model    
    def decay(t, A, tau):
        return A*np.exp(-t/tau)
    def myround(x, base):
        return (float(base) * round(float(x)/float(base)))
    
    for runnumber in range(1,7):
        data = pandas.read_csv('%s_2to5ns_50headgroups' % runnumber, header=None, names=['time', \
        'dx', 'dy', 'dz'])
        tcom = data[['time']].values
        xcom = data['dx'].values
        ycom = data['dy'].values
        zcom = data['dz'].values
        start = np.mean(zcom)
        start = myround(start, 0.25) #to match density plots
        start = start*10 #convert to angstroms
        
        #begin analysis centered around COM of headgroups (2 angstrom slices)
        l1 = start -1
    
        PDB = "50.pdb"
        XTC = "set3_%s_50.xtc" % runnumber # Enter filename for trajectory
        u = md.Universe(PDB, XTC)
        SOL = u.selectAtoms("resname SOL")
        tauvalues = []
    
        for layer in range(0,40): #Increment up to 10 A from surface
            tauvalues.append(layer) #layer=0 in first iteration, we then increment by 0.25 
            currentlayer = l1 + 0.25 * layer #angstroms.layers are in 0.25 angstrom slices 
            nextlayer = currentlayer + 2 #(we're moving a 2 A window in 0.25 A steps in Z)
            currentlayer = str('%.4g' % currentlayer)
            nextlayer = str('%.4g' % nextlayer)
            print "prop z >= %s and prop z <= %s" % (currentlayer, nextlayer)
    
            timeslice = ['Ct', 'Dt', 'Et', 'Ft', 'Gt', 'Ht', 'It', 'Jt', 'Kt', 'Lt', 'Mt']
            n = ['Cn', 'Dn', 'En', 'Fn', 'Gn', 'Hn', 'In', 'Jn', 'Kn', 'Ln']
            Cty = 0
    
            for i in range(10):
                j = i * 100 +2000 #shift analysis to start at 2 ns. Time slices are in 100 ps 
                k = j + 40 #increments, and we read from 0-100ps to 900-1000ps
                for ts in u.trajectory[j:(j+1)]: #read the trajectory for 1 ps
                    slice0 = SOL.selectAtoms("prop z >= %s and prop z <= %s" % (currentlayer, \
                    nextlayer)).residues.resids()
                n[i] = len(slice0) #n stores the total number of initial waters found
                init_res = []
                for x in slice0:
                    init_res.append(x) #append the initial resids to init_res
                
                         
                timeslice[i] = []
                for t in u.trajectory[j:k]: #read the trajectory incrementally in the current time 
                    p = 0.25                #window (100 ps)
                    reslist = SOL.selectAtoms("prop z >= %s and prop z <= %s" % (currentlayer, \
                    nextlayer)).residues.resids()
                    for x in init_res:
                        if x in reslist:
                            p+=1
                        else:
                            init_res.remove(x) #if the resid is not found, remove it from init_res
                    timeslice[i].append((u.trajectory.time, p))
                timeslice[i] = np.array(timeslice[i]) #make timeslice[] an array containing the time 
                                                      #stamp (100ps window) and number of waters 
                Cty = (timeslice[i][:,1]/n[i]) + Cty  #present (p)
                                                      #Cty is incorrect after the initial value 
                                                      #of i until it is divided by 10 later in the 
                                                      #code. It is every ps window divided by the 
            Cty = Cty/10                              #original # of waters for that window (n[]). 
            #fig = plt.figure(figsize=(12,8))         #Essentially  it is timslice[] with fraction 
                                                      #remaining waters instead of #of waters. 
            #axes = fig.add_subplot(111)              #     def decay(t, A, tau):
            #axes.plot(timeslice[0][:,0], Cty, 'r-')  #     return A*np.exp(-t/tau)
            #plt.ylabel('Autocorrelation')            #we want to solve for A and tau that gives the  
            #plt.xlabel('Time (ps)')         #the exponential decay of waters in the timeslices
            #plt.grid(True)                  #http://mx.nthu.edu.tw/~cchu/course/acrk/chapter7.pdf
            #plt.xlim(0,100)                 #res time fitting to an exponential decay is common
            #plt.show()                      #our model here mimics that of a CSTR E(t)=A*e^(-t/tau)
    
            #print Cty
            
            model = Model(decay, independent_vars=['t'])
            result = model.fit(Cty, t=np.array(range(1,41)), A=1, tau=80)
            print result.values
            temp = result.values
            tauvalues[layer] = temp['tau']
            temp = 0
        
        accessmaster = runnumber - 1
        master_set3[accessmaster] = tauvalues
