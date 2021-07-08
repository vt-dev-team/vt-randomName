import sys
from PyQt5.QtWidgets import QApplication, QMainWindow
from init import *

class StartWindow(QMainWindow, Ui_MainWindow):
    def __init__(self, parent=None):
        super(StartWindow, self).__init__(parent)
        self.setupUi(self)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    stWd = StartWindow()
    stWd.show()
    sys.exit(app.exec_())