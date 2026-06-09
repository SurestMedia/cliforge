# ⚒️ cliforge

> A scaffolding tool that generates fully structured CLI applications in Node.js, Python, or Go from a config file.

[![CI](https://img.shields.io/github/actions/workflow/status/yourusername/cliforge/ci.yml?style=for-the-badge)](https://github.com/yourusername/cliforge/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)
[![Codespace Ready](https://img.shields.io/badge/Codespace-Ready-green?style=for-the-badge&logo=github)](https://codespaces.new/yourusername/cliforge)

---

## 🚀 What is cliforge?

`cliforge` generates production-ready CLI application boilerplates from a simple YAML config. Get argument parsing, help text, subcommands, config file support, logging, and tests — all wired up and ready to ship.

```bash
# Scaffold a new CLI project
cliforge new my-tool --lang node

# From a config file
cliforge generate cliforge.yml

# Add a subcommand to existing project
cliforge add-command deploy --args "env,tag"

# Preview what will be generated
cliforge generate cliforge.yml --dry-run
```

---

## ✨ Features

- 🟢 **Node.js** — Commander.js + chalk + ora + cosmiconfig
- 🐍 **Python** — Click + rich + typer support
- 🐹 **Go** — Cobra + viper + zerolog
- 📦 Ready-to-publish package structure
- 🧪 Test scaffolding included (Jest / pytest / Go test)
- ⚙️ Config file support out of the box
- 📋 Auto-generated help text and man pages
- 🔖 Version flag and update checker

---

## ⚙️ Config Example

```yaml
# cliforge.yml
name: my-tool
description: "My awesome CLI tool"
language: node
version: "1.0.0"

commands:
  - name: run
    description: "Run the main process"
    args:
      - name: input
        required: true
      - name: output
        default: "./out"
    flags:
      - name: verbose
        short: v
        type: boolean

  - name: config
    description: "Manage configuration"
    subcommands:
      - name: set
      - name: get
      - name: reset
```

---

## 🏆 GitHub Achievement Scripts

```bash
bash scripts/setup.sh
bash scripts/unlock-all.sh
bash scripts/quickdraw.sh
bash scripts/yolo.sh
bash scripts/publicist.sh
bash scripts/pull-shark.sh 2
bash scripts/pair-extraordinaire.sh "Name" "email@example.com"
node src/achievement-tracker.js
```

---

## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)
