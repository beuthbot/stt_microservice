#!/bin/bash
if [ ! -d gdown ]
then
    git clone https://github.com/circulosmeos/gdown.pl.git gdown
fi

MODEL=./output_graph.pb
if [ ! -d "$MODEL" ]
then
    ./gdown/gdown.pl https://drive.google.com/file/d/1Dt7ddf0QmuckZksw69vCa_bjFElkG5MB/view?usp=sharing output_graph.pb
fi

SCORER=./kenlm.scorer
if [ ! -d "$SCORER" ]
then
    ./gdown/gdown.pl https://drive.google.com/file/d/1BY-G-W3bwuVvEWy7Gg_sR7gMSqDmC1pi/view?usp=sharing kenlm.scorer
fi



