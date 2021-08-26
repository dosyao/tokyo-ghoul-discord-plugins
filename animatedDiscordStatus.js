//META{"name":"AnimatedStatus"}*//

class AnimatedStatus {
  animationTime = 1000;
  timeout = 1000; // ms
  
  /* BD functions */
  getName() {
    return 'AnimatedStatus';
  }
  getVersion() {
    return '0.0.1';
  }
  getAuthor() {
    return 'vnahornyi';
  }
  getDescription() {
    return 'Animate status';
  }
  setData(key, value) {
    BdApi.setData(this.getName(), key, value);
  };
  getData(key) {
    return BdApi.getData(this.getName(), key);
  };

/* Code related to Animations */
  load() {
    Status.authToken = this.getData('token');
  };

  start() {
    if (
      ![
        this.timeout,
        Status.authToken
      ].some(el => el === undefined)) {
        this.StatusAnimate();
      }
  };

  stop() {
    clearTimeout(this.loop);
    Status.unset();
  }

  StatusAnimate() {
    Status.set(`${this.animationTime} - 7 = ${this.animationTime - 7}`);

    if (this.animationTime <= 7) {
      this.animationTime = 1000;
    } else {
      this.animationTime -= 7;
    }

    this.loop = setTimeout(() => {
      this.StatusAnimate();
    }, this.timeout);
  }

/* Settings related functions */
  getSettingsPanel() {
    const settings = document.createElement('div');

    settings.style.padding = '10px';

    // Auth Token
    settings.appendChild(GUI.newLabel('AuthToken (https://discordhelp.net/discord-token)'));

    const token = GUI.newInput();

    token.value = this.getData('token');

    settings.appendChild(token);
    settings.appendChild(GUI.newDivider());

    // Save Btn
    settings.appendChild(GUI.newDivider());

    const save = GUI.newButton('Save');

    save.onclick = () => {
      this.setData('token', token.value);
      this.setData('timeout', timeout.value);

      this.stop();
      this.load();
      this.start();
    };

    settings.appendChild(save);

    return settings;
  };
}

/* Status API */
const Status = {
  authToken: '',
  request: () => {
    let req = new XMLHttpRequest();

    req.open('PATCH', '/api/v6/users/@me/settings', true);
    req.setRequestHeader('authorization', Status.authToken);
    req.setRequestHeader('content-type', 'application/json');

    return req;
  },
  set: status => {
    Status.request().send(`{ "custom_status": { "text": "${status}", "emoji_name": null }}`);
  },
  unset: () => {
    Status.request().send('{ "custom_status": null }');
  }
};

/* GUI Wrapper */
const GUI = {
  newInput: () => {
    const input = document.createElement('input');

    input.className = 'inputDefault-_djjkz input-cIJ7To';

    return input;
  },
  newLabel: text => {
    const label = document.createElement('h5');

    label.className = 'h5-18_1nd';
    label.innerText = text;

    return label;
  },
  newDivider: () => {
    const divider = document.createElement('div');

    divider.style.paddingTop = '15px';

    return divider;
  },
  newButton: text => {
    const button = document.createElement('button');

    button.className = 'button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeSmall-2cSMqn';
    button.innerText = text;

    return button;
  }
};
