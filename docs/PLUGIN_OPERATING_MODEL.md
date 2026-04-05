# Plugin Operating Model

This plugin is intentionally **global-first**.

It is designed to be installed once and then used inside many different Next.js repositories.
Its main job is not only to guide frontend work, but to help Copilot inspect an active repo and generate the **minimum strong set of repo-local frontend assets** when justified.

That means:
- global plugin = reusable operating system
- repo-level instructions / prompts / skills = generated local execution system
