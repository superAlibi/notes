# windows wsl

我所工作过的公司大部分开发者都是使用windows,仅仅遇到过两个不用Windows开发的,一个使用arch linux 的衍生版,一个使用mac 小主机 :)

我就喜欢linux,主要是耳濡目染,加上linux确实很好用,遇到问题都能找到解决办法,但是Windows就会出现有些很神奇的事情.我最恨的就是文件大小写不分(我知道可以配置).

还有linux确实很快.

wsl成为我开发过程中不可或缺的一部分.同样,linux也是

## wsl2官方文档
## wsl2简介
## wsl2网络

如果你使用了clash-verge,即使你关闭了,那么wsl2的网络也会受到影响,需要重新配置.

至于我遇到了哪些坑:
1. `/etc/environment.d/default-env.conf`
2. `/etc/profile.d/defaut.env.sh`
3. `/etc/systemd/system.conf.d/default-env.conf`


[官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/networking#mirrored-mode-networking)


## wsl2与hostname
