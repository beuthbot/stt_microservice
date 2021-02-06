#!/bin/bash

apt-get update

curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs

apt-get install sox -y

git clone https://github.com/circulosmeos/gdown.pl.git gdown

./gdown/gdown.pl https://drive.google.com/file/d/1Dt7ddf0QmuckZksw69vCa_bjFElkG5MB/view?usp=sharing output_graph.pb

./gdown/gdown.pl https://drive.google.com/file/d/1BY-G-W3bwuVvEWy7Gg_sR7gMSqDmC1pi/view?usp=sharing kenlm.scorer

git clone --branch v0.9.3 https://github.com/mozilla/DeepSpeech
cp output_graph.pb DeepSpeech/output_graph.pb
cd DeepSpeech

pip3 install --upgrade pip==20.2.2 wheel==0.34.2 setuptools==49.6.0
pip3 install --upgrade -e .
apt-get install python3-dev -y

python3 util/taskcluster.py --source tensorflow --artifact convert_graphdef_memmapped_format --branch r1.15 --target .

./convert_graphdef_memmapped_format --in_graph=output_graph.pb --out_graph=output_graph.pbmm
cp output_graph.pbmm ../output_graph.pbmm

