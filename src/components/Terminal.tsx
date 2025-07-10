import React, { useEffect, useRef, useState } from 'react';
import commandsData from '../data/commands.json';
import { TERMINAL_CONFIG } from '../config/terminalConfig';

interface Command {
  cmd: string;
  desc: string;
  outputLines: string[];
}

// User's custom rhino ASCII art and CODERHINO block
const RHINO_ART = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡐⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⣼⢹⠀⠀⠀⠀⠀⠀⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣐⣠⣄⣐⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣼⣿⢹⠀⠀⠀⠀⡜⢲⡖⣶⣦⠀⠀⠀⡄⠀⠀⡄⢪⣾⠋⠀⣴⣾⣿⡗⢡⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                        ⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢀⢡⡏⢾⡟⠀⠀⠀⠰⢰⡌⣿⠄⡬⣷⣩⠶⡾⠟⠛⠶⡾⠃⣠⣾⣿⣿⠄⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                        ⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⡀⣾⠀⢾⣇⠅⠀⠀⠀⣾⣷⡹⣤⣿⠟⠁⠐⠀⠀⠀⠈⠰⠾⢿⣿⠿⠋⡌⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                        ⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢡⡏⠀⡀⢿⡌⡀⠀⡇⣿⠌⢷⣴⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠈⠛⠳⢦⣅⡠⠀⠀⠀⠀⠀⠀                                ░░░              ░░░░░░░     ░░░                                          ⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠡⠸⣿⡔⠀⡇⣿⠈⠄⠻⣿⡀⠀⠀⠀⠀⠀⠀⠀⣀⢀⡀⠀⠀⠀⡙⢿⣦⡀⡀⠀    ░▒▓███▓░    ░▓██▓▒            ▒█▓              ▓▓▓▓▓▓▒░░   ▒██           ░▓█▒                    ░▒███▓░   ⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠂⢹⣿⣮⡂⢻⡀⠈⠀⠈⠙⠶⡄⠀⠀⣠⠆⠀⠀⠠⡀⠀⠂⠀⠀⡀⠹⣿⡌⠄  ░███░░░░▓█▒░░██▓░░░██░          ▒█▓              ██░░░░▒███░ ▒██           ░██▓                   ▓██░░░▓█  ⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⡜⣧⠀⠀⠈⠀⠻⡌⠻⣮⣷⣐⢄⡀⠢⣰⠏⠀⢰⣏⠀⠀⠀⠀⠙⣦⡀⠀⢂⠠⠀⢻⣿⡐░▒██░         ██░   ░███░   ░░▒▒░░▒█▓    ░░▒▒▒░░   ██░     ▓██░▒██ ░░▒▒░░  ░░░░░░░    ░░░▒▒▒░     ▒██░  ░███▓ ⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠠⢻⡄⠀⠀⠀⠢⡙⠄⠀⠉⠛⠿⣿⡛⠁⠀⠀⡏⢸⠆⠀⢀⡤⠀⠘⣷⡄⠀⢢⠀⢸⣿⡇░██░         ▒██   ░█░▓█▒ ░▓██▓▒▒███▓  ░▓██▓▒▓██▓░ ██░     ▓██░▒████▒▒▓██░ ░▓▓▓▓██    ░██████▓    ██▒  ░██░██░⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢊⢷⡀⠀⠀⠀⠀⠢⠀⠀⠀⠀⠀⢹⡆⠀⢠⣧⠏⢀⣴▓⠀⠀⢈⣿⣿⡀⠈⠀⣼⣿⡇▒██          ▓█▓  ░█▒ ▓██ ▓██░    ▒█▓  ▓█▓    ░▓█▓ ██░  ░░▓██░ ▒██░    ▒█▓     ░██    ░██    ░██  ██░  ▓█░░██░⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠊⢻⣄⠀⢄⠀⠀⠈⠐⠠⡀⠀⢼⡇⠠⠊⠁⢠⠎⣠⣿⠀⣠⣾⣿⣿⣧⠀⢰⣿⣿⢱▒██          ▓█▓ ░█▒  ▓██ ██░     ▒█▓ ░██░░░░░░░██ ███████▒░   ▒██     ▒█▓     ░██    ░██     ░██ ██░▒█░  ░██░⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠝⢧⣄⠳⣦⣀⠀⠀⠠⢈⡾⢁⡶⠛⢶⣇⠀⢡⣿⣾⣿⣿⣿⣿⣿⢠⣿⢟⡟⡁░██░         ▒██░█▓   ▓█▓ ██░     ▒█▓ ░██████████▓ ██░  ▒██░   ▒██     ▒█▓     ░██    ░██     ░██ ██░▒█░  ░██░⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⡍⣿⠶⢿⣿⡶⠶⠋⠀⠊⠀⣾⠀⣿⣴⣿⠿⠿⢿⣿⣿⣿⣿⣿⠟⡁⠑⠀░▓█▓░         ███▓   ░██░ ██▒     ▒█▓ ░██▒         ██░   ▒██░  ▒██     ▒█▓     ░██    ░██     ░██ ▓███░   ▓█▓ ⠀                              ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢯⣀⠀⠀⠀⠀⠀⠀⣀⣀⣙⣤⣿⣿⢃⠀⠀⠁⠜⣿⣿⡿⠫⠀⠣⠁⠀⠀ ▓██▒░░░░▒█▓░▒██░ ░░██▒░ ░██▒░ ░▒██▓  ░██▓░  ░▒▓░ ██░    ░██▒ ▒██     ▒█▓ ░░░░░██░░░░░██     ░██ ░▓█▓░ ░▓██  ⠀⠀⠀                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢆⢿⡶⠶⠶⣶⣶⣤⣤⣨⣽⡿⠋⠑⠀⠀⠀⠀⢰⢸⠟⠀⠀⠀⠁⠀⠀⠀⠀⠀░▒▓█████▒░  ░▒████▓░    ░▓████▒░█▓    ▒█████▓░░ ██░     ░██▒▒██     ▒█▓ ░█████████▓░██     ░██ ░░█████▒   ⠀⠀⠀⠀⠀⠀⠀⠀                      ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠀⠜⠛⠿⢿⣿⠟⠘⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"
];
/*
const RHINO_ART = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡐⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⣼⢹⠀⠀⠀⠀⠀⠀⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣐⣠⣄⣐⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣼⣿⢹⠀⠀⠀⠀⡜⢲⡖⣶⣦⠀⠀⠀⡄⠀⠀⡄⢪⣾⠋⠀⣴⣾⣿⡗⢡⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ _____           _____         _____        ______        _____    ____   ____  ____  _____   ______           _____                   ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢀⢡⡏⢾⡟⠀⠀⠀⠰⢰⡌⣿⠄⡬⣷⣩⠶⡾⠟⠛⠶⡾⠃⣠⣾⣿⣿⠄⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀___|\\    \\     ____|\\    \\    ___|\\    \\   ___|\\     \\   ___|\\    \\  |    | |    ||    ||\\    \\ |\\     \\     ____|\\    \\  ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⡀⣾⠀⢾⣇⠅⠀⠀⠀⣾⣷⡹⣤⣿⠟⠁⠐⠀⠀⠀⠈⠰⠾⢿⣿⠿⠋⡌⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀/    /\\    \\   /     /\\    \\  |    |\\    \\ |     \\     \\ |    |\\    \\ |    | |    ||    | \\\\    \\| \\     \\   /     /\\    \\",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢡⡏⠀⡀⢿⡌⡀⠀⡇⣿⠌⢷⣴⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠈⠛⠳⢦⣅⡠⠀⠀⠀⠀⠀⠀⠀|    |  |    | /     /  \\    \\ |    | |    ||     ,_____/||    | |    ||    |_|    ||    |  \\|    \\  \\     | /     /  \\    \\         ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠡⠸⣿⡔⠀⡇⣿⠈⠄⠻⣿⡀⠀⠀⠀⠀⠀⠀⠀⣀⢀⡀⠀⠀⠀⡙⢿⣦⡀⡀⠀⠀⠀⠀|    |  |____||     |    |    ||    | |    ||     \\--'\\_|/|    |/____/ |    .-.    ||    |   |     \\  |    ||     |    |    |            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠂⢹⣿⣮⡂⢻⡀⠈⠀⠈⠙⠶⡄⠀⠀⣠⠆⠀⠀⠠⡀⠀⠂⠀⠀⡀⠹⣿⡌⠄⠀⠀⠀|    |   ____ |     |    |    ||    | |    ||     /___/|  |    | |    ||    | |    ||    |   |      \\ |    ||     |    |    |            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⡜⣧⠀⠀⠈⠀⠻⡌⠻⣮⣷⣐⢄⡀⠢⣰⠏⠀⢰⣏⠀⠀⠀⠀⠙⣦⡀⠀⢂⠠⠀⢻⣿⡐⠀⠀⠀|    |  |    ||\\     \\  /    /||    | |    ||     \\____\\  |    | |    ||    | |    ||    |   |    |\\ \\|    ||\\     \\  /    /|       ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠠⢻⡄⠀⠀⠀⠢⡙⠄⠀⠉⠛⠿⣿⡛⠁⠀⠀⡏⢸⠆⠀⢀⡤⠀⠘⣷⡄⠀⢢⠀⢸⣿⡇⠀⠀⠀|\\ ___\\/    /|| \\_____\\____/ ||____|/____/||____ '     /| |____| |____||____| |____||____|   |____||\\_____/|| \\_____\\____/ | |       ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢊⢷⡀⠀⠀⠀⠀⠢⠀⠀⠀⠀⠀⢹⡆⠀⢠⣧⠏⢀⣴⣿⠀⠀⢈⣿⣿⡀⠈⠀⣼⣿⡇⠀⠀⠀| |   /____/ | \\ |    ||    | /|    /    | ||    /_____/ | |    | |    ||    | |    ||    |   |    |/ \\|   || \\ |    ||    | /           ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠊⢻⣄⠀⢄⠀⠀⠈⠐⠠⡀⠀⢼⡇⠠⠊⠁⢠⠎⣠⣿⠀⣠⣾⣿⣿⣧⠀⢰⣿⣿⢱⠀⠀⠀⠀\\|___|    | /  \\|____||____|/ |____|____|/ |____|     | / |____| |____||____| |____||____|   |____|   |___|/  \\|____||____|/            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠝⢧⣄⠳⣦⣀⠀⠀⠠⢈⡾⢁⡶⠛⢶⣇⠀⢡⣿⣾⣿⣿⣿⣿⣿⢠⣿⢟⡟⡁⠀⠀⠀⠀⠀ \\( |____|/      \\(    )/      \\(    )/     \\( |_____|/   \\(     )/    \\(     )/    \\(       \\(       )/       \\(    )/           ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⡍⣿⠶⢿⣿⡶⠶⠋⠀⠊⠀⣾⠀⣿⣴⣿⠿⠿⢿⣿⣿⣿⣿⣿⠟⡁⠑⠀⠀⠀⠀⠀⠀⠀'   )/          '    '        '    '       '    )/       '     '      '     '      '        '       '         '    '                    ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢯⣀⠀⠀⠀⠀⠀⠀⣀⣀⣙⣤⣿⣿⢃⠀⠀⠁⠜⣿⣿⡿⠫⠀⠣⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀  '                                           '                                                                                       ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢆⢿⡶⠶⠶⣶⣶⣤⣤⣨⣽⡿⠋⠑⠀⠀⠀⠀⢰⢸⠟⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠀⠜⠛⠿⢿⣿⠟⠘⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                                                                                                                            ",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"
];
*/

const WELCOME_LINES = [
  'Welcome to the CODERHINO Terminal Portfolio',
  "Type 'help' for available commands",
  ''
];

/**
 * Main Terminal component that handles the interactive terminal interface
 * Integrates xterm.js with custom command processing and typewriter effects
 */
const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  // Command history and input buffer management
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1); // -1 means not navigating
  const currentLineBuffer = useRef<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [typewriterTimeout, setTypewriterTimeout] = useState<NodeJS.Timeout | null>(null);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Initialize xterm.js terminal - only once
  useEffect(() => {
    // Only run on client and if not already initialized
    if (typeof window === 'undefined' || !terminalRef.current || isInitialized) return;

    let Terminal: any, FitAddon: any;
    let terminal: any, fitAddon: any;

    (async () => {
      try {
        const xtermPkg = await import('@xterm/xterm');
        const fitPkg = await import('@xterm/addon-fit');
        await import('@xterm/xterm/css/xterm.css');
        Terminal = xtermPkg.Terminal;
        FitAddon = fitPkg.FitAddon;

        terminal = new Terminal({
          cursorBlink: true,
          theme: {
            background: TERMINAL_CONFIG.appearance.backgroundColor,
            foreground: TERMINAL_CONFIG.appearance.foregroundColor,
            cursor: TERMINAL_CONFIG.appearance.cursorColor,
            black: '#000000',
            red: '#cd3131',
            green: '#0dbc79',
            yellow: '#e5e510',
            blue: '#2472c8',
            magenta: '#bc3fbc',
            cyan: '#11a8cd',
            white: '#e5e5e5',
            brightBlack: '#666666',
            brightRed: '#f14c4c',
            brightGreen: '#23d18b',
            brightYellow: '#f5f543',
            brightBlue: '#3b8eea',
            brightMagenta: '#d670d6',
            brightCyan: '#29b8db',
            brightWhite: '#ffffff'
          },
          fontFamily: 'Source Code Pro, monospace',
          fontSize: 11,
          lineHeight: 1.0,
          scrollback: 1000,
          cols: 80,
          rows: 24
        });

        fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current);
        fitAddon.fit();

        // Store references
        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;
        setIsInitialized(true);

        // Print banner and welcome
        printBannerAndWelcome();
        writePrompt();

        // Handle window resize
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        // Handle terminal input
        terminal.onKey(({ key, domEvent }: any) => {
          if (isTyping) {
            // Handle Ctrl+C to interrupt typewriter effect
            if (domEvent.key === 'c' && domEvent.ctrlKey) {
              interruptTypewriter();
            }
            return; // Don't accept other input while typing
          }

          const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

          switch (domEvent.key) {
            case 'Enter':
              terminal.write('\r\n');
              handleCommand(currentLineBuffer.current.trim());
              if (currentLineBuffer.current.trim()) {
                commandHistory.current.push(currentLineBuffer.current);
              }
              historyIndex.current = commandHistory.current.length;
              currentLineBuffer.current = '';
              break;
            case 'Backspace':
              if (currentLineBuffer.current.length > 0) {
                currentLineBuffer.current = currentLineBuffer.current.slice(0, -1);
                terminal.write('\b \b');
              }
              break;
            case 'ArrowUp':
              if (commandHistory.current.length && historyIndex.current > 0) {
                // Clear current line
                for (let i = 0; i < currentLineBuffer.current.length; i++) {
                  terminal.write('\b \b');
                }
                historyIndex.current--;
                currentLineBuffer.current = commandHistory.current[historyIndex.current] || '';
                terminal.write(currentLineBuffer.current);
              }
              break;
            case 'ArrowDown':
              if (commandHistory.current.length && historyIndex.current < commandHistory.current.length - 1) {
                for (let i = 0; i < currentLineBuffer.current.length; i++) {
                  terminal.write('\b \b');
                }
                historyIndex.current++;
                currentLineBuffer.current = commandHistory.current[historyIndex.current] || '';
                terminal.write(currentLineBuffer.current);
              } else if (historyIndex.current === commandHistory.current.length - 1) {
                for (let i = 0; i < currentLineBuffer.current.length; i++) {
                  terminal.write('\b \b');
                }
                historyIndex.current = commandHistory.current.length;
                currentLineBuffer.current = '';
              }
              break;
            default:
              if (printable && domEvent.key.length === 1) {
                currentLineBuffer.current += key;
                terminal.write(key);
              }
          }
        });

        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (terminal && !terminal.disposed) {
            terminal.dispose();
          }
        };
      } catch (error) {
        console.error('Failed to initialize terminal:', error);
      }
    })();
  }, [isInitialized]); // Only depend on isInitialized

  // Interrupt typewriter effect
  const interruptTypewriter = () => {
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      setTypewriterTimeout(null);
    }
    setIsTyping(false);
    if (xtermRef.current) {
      xtermRef.current.write('\r\n');
      writePrompt();
    }
  };

  // Print banner and welcome message, side by side
  const printBannerAndWelcome = () => {
    if (!xtermRef.current) return;
    
    // Get rhino color from config
    const rhinoColor = hexToRgb(TERMINAL_CONFIG.colors.rhino);
    
    // Print rhino art with color
    const maxLines = Math.max(RHINO_ART.length);
    for (let i = 0; i < maxLines; i++) {
      const rhinoLine = (RHINO_ART[i] || '').trimStart();
      if (rhinoColor) {
        const coloredLine = `\x1b[38;2;${rhinoColor.r};${rhinoColor.g};${rhinoColor.b}m${rhinoLine.padEnd(70, ' ')}\x1b[0m\r\n`;
        xtermRef.current.write(coloredLine);
      } else {
        xtermRef.current.write(rhinoLine.padEnd(70, ' ') + '\r\n');
      }
    }
    WELCOME_LINES.forEach(line => xtermRef.current.write(line + '\r\n'));
  };

  // Write the terminal prompt with color
  const writePrompt = () => {
    if (!xtermRef.current) return;
    
    const promptColor = hexToRgb(TERMINAL_CONFIG.colors.prompt);
    if (promptColor) {
      const coloredPrompt = `\x1b[38;2;${promptColor.r};${promptColor.g};${promptColor.b}m${TERMINAL_CONFIG.appearance.prompt}\x1b[0m`;
      xtermRef.current.write(coloredPrompt);
    } else {
      xtermRef.current.write(TERMINAL_CONFIG.appearance.prompt);
    }
  };

  // Handle command execution
  const handleCommand = (command: string) => {
    if (!xtermRef.current) return;
    
    // Add command to history
    if (command.trim()) {
      commandHistory.current.push(command);
    }
    
    xtermRef.current.write('\r\n');
    
    if (!command.trim()) {
      writePrompt();
      return;
    }
    
    const cmd = command.toLowerCase();
    
    if (cmd === 'help') {
      // Generate help output as lines and use typewriter effect
      const helpLines = [
        "",
        'Available commands:',
        ""
      ];
      (commandsData as Command[]).forEach(cmdObj => {
        const padding = ' '.repeat(15 - cmdObj.cmd.length);
        helpLines.push(`  ${cmdObj.cmd}${padding} - ${cmdObj.desc}`);
      });
      //helpLines.push('');
      displayCommandOutput(helpLines, 'info');
    } else if (cmd === 'clear') {
      clearTerminal();
    } /*else if (cmd === 'contact') {
      const commandData = (commandsData as Command[]).find(c => c.cmd === cmd);
      if (commandData) {
        displayCommandOutput(commandData.outputLines, 'warning');
      }
    } */else {
      const commandData = (commandsData as Command[]).find(c => c.cmd === cmd);
      
      if (commandData) {
        displayCommandOutput(commandData.outputLines);
      } else {
        // Display error with red color
        displayCommandOutput([`command not found: ${command}`], 'error');
      }
    }
  };

  // Clear the terminal
  const clearTerminal = () => {
    if (!xtermRef.current) return;
    
    xtermRef.current.clear();
    printBannerAndWelcome();
    writePrompt();
  };

  // Display command output with typewriter effect and color support
  const displayCommandOutput = (lines: string[], type: 'normal' | 'error' | 'success' | 'warning' | 'info' = 'normal') => {
    if (!xtermRef.current) return;
    
    setIsTyping(true);
    
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    
    const typeNextChar = () => {
      if (currentLineIndex >= lines.length) {
        setIsTyping(false);
        setTypewriterTimeout(null);
        xtermRef.current!.write('\r\n');
        writePrompt();
        return;
      }
      
      const currentLine = lines[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        // Apply color based on type using config colors
        let colorHex = TERMINAL_CONFIG.colors.output; // Default white
        switch (type) {
          case 'error':
            colorHex = TERMINAL_CONFIG.colors.error;
            break;
          case 'success':
            colorHex = TERMINAL_CONFIG.colors.success;
            break;
          case 'warning':
            colorHex = TERMINAL_CONFIG.colors.warning;
            break;
          case 'info':
            colorHex = TERMINAL_CONFIG.colors.info;
            break;
          default:
            colorHex = TERMINAL_CONFIG.colors.output;
        }
        
        const color = hexToRgb(colorHex);
        if (color) {
          const colorCode = `\x1b[38;2;${color.r};${color.g};${color.b}m`;
          xtermRef.current!.write(colorCode + currentLine[currentCharIndex]);
        } else {
          xtermRef.current!.write(currentLine[currentCharIndex]);
        }
        
        currentCharIndex++;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.charDelay);
        setTypewriterTimeout(timeout);
      } else {
        xtermRef.current!.write('\x1b[0m\r\n'); // Reset color and new line
        currentLineIndex++;
        currentCharIndex = 0;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.lineDelay);
        setTypewriterTimeout(timeout);
      }
    };
    
    typeNextChar();
  };

  return (
    <div className="terminal-container">
      <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default Terminal; 