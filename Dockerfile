FROM node:lts-alpine3.13

ENV HOME=/home/node
ENV APP=${HOME}/app
ENV ZSH_CUSTOM=${HOME}/.oh-my-zsh

USER root

RUN apk add --no-cache zsh zsh-vcs git \
  && apk add curl wget --update \
  && yarn config set cache-folder ${HOME}/.yarn-cache \
  && yarn global add @nestjs/cli

WORKDIR ${HOME}

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" \
  && git clone https://github.com/denysdovhan/spaceship-prompt.git "${ZSH_CUSTOM}/themes/spaceship-prompt" \
  && ln -s "${ZSH_CUSTOM}/themes/spaceship-prompt/spaceship.zsh-theme" "${ZSH_CUSTOM}/themes/spaceship.zsh-theme" \
  && sh -c "$(curl -fsSL https://raw.githubusercontent.com/zdharma/zinit/master/doc/install.sh)"

COPY ./terminal/.zshrc ${HOME}/.zshrc

WORKDIR ${APP}
