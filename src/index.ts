import path from "path";
import {
  QMainWindow,
  QWidget,
  QLabel,
  FlexLayout,
  QPushButton,
} from "@nodegui/nodegui";
import { downloadFile } from "./downloadHandler";
import { getApplicationInstallLocation, getUserDataPath } from "./utils";

const win = new QMainWindow();
win.setWindowTitle("comm.io Installer");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const ProgressLabel = new QLabel();
ProgressLabel.setInlineStyle("color: #000;");

const InstallButton = new QPushButton();
InstallButton.setObjectName("InstallButton");
InstallButton.setInlineStyle("color: #000;");
InstallButton.setText("Install comm.io");
InstallButton.addEventListener("clicked", async () => {
  let downloadTotalLength = 0;

  const configFile = await downloadFile(
    "config.json",
    "https://mauricio-is-testing.s3.amazonaws.com/sandbox-config.json",
    path.resolve(getUserDataPath(), "comm.io"),
    {
      onDownloadInitialize: ({ totalLength }) => {
        downloadTotalLength = totalLength;
        ProgressLabel.setText(
          `Downloading configurations 0 / ${downloadTotalLength}`
        );
      },
      onDownloadTick: (progress) => {
        ProgressLabel.setText(
          `Downloading configurations successfuly ${progress} / ${downloadTotalLength}`
        );
      },
    }
  );

  ProgressLabel.setText(
    `Downloaded configurations ${downloadTotalLength} / ${downloadTotalLength}`
  );

  const applicationDownload = await downloadFile(
    "comm.io.app.zip",
    "https://mauricio-is-testing.s3.amazonaws.com/comm.io.app.zip",
    getApplicationInstallLocation(),
    {
      onDownloadInitialize: ({ totalLength }) => {
        downloadTotalLength = totalLength;
        ProgressLabel.setText(
          `Downloading application 0 / ${downloadTotalLength}`
        );
      },
      onDownloadTick: (progress) => {
        ProgressLabel.setText(
          `Downloading application ${progress} / ${downloadTotalLength}`
        );
      },
    }
  );
  ProgressLabel.setText(
    `Downloaded application successfuly ${downloadTotalLength} / ${downloadTotalLength}`
  );
});

rootLayout.addWidget(InstallButton);
rootLayout.addWidget(ProgressLabel);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #fff;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
  `
);
win.show();

(global as any).win = win;
