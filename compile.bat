## Pyinstaller
#pyinstall -F -w main.py

## nuitka

nuitka --mingw64 --standalone --windows-disable-console --show-progress --show-memory --include-package=PyQt5 --plugin-enable=qt-plugins --include-qt-plugins=sensible,styles --output-dir=releases --windows-icon-from-ico=evol/logo.ico main.py

pause