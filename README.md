
# setup

## nodebrew

install nodebrew (node version manager)

```curl -L git.io/nodebrew | perl - setup```

add nodebrew to PATH for example at ~/.profile

```export PATH=$HOME/.nodebrew/current/bin:$PATH```

```source ~/.profile```

## nodejs (v 9.11.2)

install nodejs using nodebrew

```nodebrew install-binary 9.11.2```

use it

```nodebrew use 9.11.2```

## install uuidgen

```sudo apt-get install uuid-runtime```

## clone this node app

```git clone https://github.com/yasushisakai/hackbicycle-bluetooth```
```chmod +x start.sh```
```npm install```

## set node to run on root/sudo

```sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)```

# how to run
```cd hackbicycle_bluetooth```
```npm start```

# add start.sh to rc.local for starting this up
