#!/bin/bash

for ((i=1;i<=5;i++)); do
    for ((j=1;j<=5;j++)); do
	vi ${i}_depth_${j}_trees.txt
	:%s/\n//g
	:wq
    	echo $j $i
    done
done
