---
title: "Viscosity in molecular dynamics"
layout: post
---

###Concept: Force / Area

The idea of viscous forces is somewhat analogous to pressure in that the significan parameter is the force acting per unit area. Physically, however, it is completely different. In the case of viscous forces, the force is acting parallel to the area, not perpendicular to it as is the case of pressure. 

Newton considered a fluid sandwiched between two plates, with the top plate in motion and the bottom stationary. He conjectured that the necessary force per unit area, F/A,  to incite the fluid would be proportional to the velocity gradient in the fluid:

$\frac{F}{A} = \frac{\eta v_{0}}{d}$

where $v_{0}$ is the speed of the top plate, $\eta$ is the viscosity coefficient, and $d$ is the distance between the plates. $\frac{F}{A}$ is the rate at which momentum in the x-direction is being supplied per unit area to the fluid. This will be explained further in the following section.

###Concept: Viscous force may be interpreted as a rate of transfer of momentum into the fluid

The conservation of momentum dictates that some kinetic energy will be lost&mdash;transformed into heat energy&mdash;as momentum is transfered between particles of a fluid.  

*Exercise: It is simple to prove this to oneself. Consider a mass m of fluid moving at v1 and a mass m moving at v2 in the same direction. Momentum conservation tells us that the mixed mass 2m moves at ½( v1 + v2). Show that the total kinetic energy has decreased if v1, v2 are unequal.*

*This is the fraction of the kinetic energy that has disappeared into heat*

In this way, we can see that the viscosity coefficient, $\eta$, is the measure of friction, i.e. it represents the dissipation into heat energy from the kinetic energy of the particles as momentum is transfered. (Note: there is also a contribution to viscosity from the *passive* diffusion of particles but this is more prominant for gases than for liquids)

Consider again the two plates example whereupon we derived: 

$\frac{F}{A} = \frac{\eta v_{0}}{d}$

Take the direction of velocity of the top plate to be x and the dimension between the plates to be z (these dimensions will retain their significance when we discuss GROMACS). This *transport* equation illustrates that the rate of momentum in the x-direction transfered *downward* (the z-direction) is proportional to the rate of change in velocity and the coefficient of that proportionality is viscosity. 

Put another way, momentum (the left hand side of our equation) is conserved and envokes either kinetic energy or heat energy in the direction of its transfer, depending on the viscosity of the fluid.  

##Non-equilibrium simulations

In MD, we can exploit the relationship between kinetic energy and heat loss to calculate viscosity. In GROMACS we apply an external force and remove the generated heat by coupling the system to a heat bath. In GROMACS the applied force, or acceleration profile, is applied in the x-direction as:

$a_{x}(z) = A cos(\frac{2 \pi z}{l_{z}})$

where $l_{z}$ is the length of the box in the z-direction and A is the acceleration factor. The resulting velocity gradient:

$a_{x}(z) + \frac{\eta}{\rho} \frac{\partial^2 v_{x}(z)}{\partial z^2} = 0$

GROMACS computes the viscosity as:

$\eta = \frac{A}{V}\rho(\frac{l_{z}}{2\pi})^2$

which is supplied in the output file as $\frac{1}{\eta}$ and V is defined as:

$V = \frac{\sum_{i=1}^N m_{i}v_{i,x} 2 \cos \frac{2 \pi z}{l_{z}}}{\sum_{i=1}^N m_{i}}$ 


##Equilibrium simulations
The **Einstein relation** states that:

$\eta= \frac{1}{2} \frac{V}{K_{B}T} \lim_{t \to \infty} \frac{d}{dt} \langle ( \int_{t_{0}}^{t_{0} + t} P_{\alpha \beta}(t') \, \mathrm{d}t')^2 \rangle_{t_{0}}$

Which is equivalent to the **Green-Kubo** formula:

$\eta= \frac{V}{K_{B}T} \int_{0}^{\infty} \langle P_{\alpha \beta}(t_{0}) \cdot P_{\alpha \beta}(t-t_{0}) \rangle \, \mathrm{d}t$

These are dependent on the off-diagonal components of the stress tensor, $P_{\alpha \beta}$. Short *simulation times* and short *electrostatic cut-offs* result in large noise in these elements. If length and cut-offs are sufficient, however, g_energy can be used to calculate the viscosity.
