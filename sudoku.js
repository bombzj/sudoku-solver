
var data;
let colb = new Uint16Array(9);
let rowb = new Uint16Array(9);
let block = new Uint16Array(9);
let blocked = [];   // numbers that are occupied by other position (bit wise)
let sumfound;

function solve(dodata) {
    // data[row][col]
    data = dodata;
    // prepare
    let empty = 0;      // how many empty slots
    for(let i = 0;i < 9;i++) {
        let b = Math.trunc(i / 3) * 3;  // block 0 - 8
        for(let j = 0;j < 9;j++) {
            let b2 = b + Math.trunc(j / 3);
            let d = data[i][j] - 1;
            if(d >= 0) {
                colb[i] |= 1 << d;
                rowb[j] |= 1 << d;
                block[b2] |= 1 << d;
            } else {
                empty++;
            }
        }
    }

    // prepare blocked data for each position
    for(let i = 0;i < 9;i++) {
        blocked[i] = new Uint16Array(9);

        let b = Math.trunc(i / 3) * 3;  // block 0 - 8
        for(let j = 0;j < 9;j++) {
            if(data[i][j] == 0) {
                let b2 = b + Math.trunc(j / 3);
                blocked[i][j] = colb[i] | rowb[j] | block[b2];
            } else {
                blocked[i][j] = 0b111111111;
            }
        }
    }

    displayblocked();
    let cd = 10;
    while(empty > 0 && --cd > 0) {
        sumfound = 0;      // cannot solve if run to the end and yet 0
        // looking for slot that number can fit
        let found = -1;
        for(let i = 0;i < 9;i++) {
            for(let n = 0;n < 9;n++) {
                let bitn = 1 << n;
                found = -1;
                for(let j = 0;j < 9;j++) {
                    if(blocked[i][j] & bitn == 0) {
                        if(found == -1) {
                            found = j;
                        } else {
                            found = -2; // multiple possibility
                            break;
                        }
                    }
                }
                
                if(found >= 0) {
                    putone(i, found, n);
                }
                //  else if(found == -1) {
                //     console.log("error " + n + ' at col ' + i);
                // }

                found = -1;
                for(let j = 0;j < 9;j++) {
                    if((blocked[j][i] & bitn) == 0) {
                        if(found == -1) {
                            found = j;
                        } else {
                            found = -2; // multiple possibility
                            break;
                        }
                    }
                }
                
                if(found >= 0) {
                    putone(found, i, n);
                }
                //  else if(found == -1) {
                //     console.log("error " + n + ' at row ' + i);
                // }

                let row2 = Math.trunc(i / 3) * 3;  // block 0 - 8
                let col2 = (i % 3) * 3;
                found = -1;
                for(let j = 0;j < 9;j++) {
                    let row = Math.trunc(j / 3) + row2;  // block 0 - 8
                    let col = (j % 3) + col2;
                    if((blocked[row][col] & bitn) == 0) {
                        if(found == -1) {
                            found = j;
                        } else {
                            found = -2; // multiple possibility
                            break;
                        }
                    }
                }
                if(found >= 0) {
                    let row = Math.trunc(found / 3) + row2;  // block 0 - 8
                    let col = (found % 3) + col2;
                    putone(row, col, n);
                }
            }

            
        }

        // looking for number to fit slot
        for(let i = 0;i < 9;i++) {
            for(let j = 0;j < 9;j++) {
                let found = -1;
                let tmp = 1;
                for(let n = 0;n < 9;n++) {
                    if((blocked[i][j] & tmp) == 0) {
                        if(found == -1) {
                            found = n;
                        } else {
                            found = -2; // multiple possibility
                            break;
                        }
                        
                    }
                    tmp <<= 1;
                }
                if(found > 0) {
                    putone(i, j, found);
                }
            }
        }



        if(sumfound == 0) {
            if(processxd) {
                processx();
                processxd = false;
            } else {
                console.log('stuck here');
                break;
            }
        } else {
            empty -= sumfound;
            processxd = true;
        }
    }

    displayblocked();

    // display
    let ret = '';
    for(let i = 0;i < 9;i++) {
        for(let j = 0;j < 9;j++) {
            if(data[i][j]) {
                ret += data[i][j] + '&nbsp;';
            } else {
                ret += '&nbsp;&nbsp;';
            }
        }
        ret += '<br/>';
    }
   
    return ret;
}

function putone(row, col, n) {
    if(data[row][col]) {
        return;
    }
    sumfound++;
    let number = n + 1;
    data[row][col] = number;
    blocked[row][col] = 0b111111111;
    let bitn = 1 << n;
    let row2 = Math.trunc(row / 3) * 3;  // block 0 - 8
    let col2 = Math.trunc(col / 3) * 3;
    // update
    for(let i = 0;i < 9;i++) {
        blocked[i][col] |= bitn;
        blocked[row][i] |= bitn;        
    }
    for(let i = 0;i < 3;i++) {
        for(let j = 0;j < 3;j++) {
            blocked[row2 + i][col2 + j] |= bitn;
        }
    }
    console.log("put " + number + ' at ' + (row + 1) + '/' + (col + 1));
    // displayblocked();
}

function displayblocked(row, col) {
    // display blocked array
    for(let i = 0;i < 9;i++) {
        for(let j = 0;j < 9;j++) {
            if(i == row && j == col) {
                s2.innerHTML += '<font color="red">' + blocked[i][j].toString(2).padStart(9, '0') + '</font> ';
            } else {
                s2.innerHTML += blocked[i][j].toString(2).padStart(9, '0') + ' ';
            }
        }
        s2.innerHTML += '<br/>';
    }
    s2.innerHTML += '<br/>';
}

var processxd = true;
// another strategy
function processx() {
    // row
    for(let i = 0;i < 9;i++) {
        for(let n1 = 0;n1 < 9;n1++) {
            if(data[i][n1]) {
                continue;
            }
            for(let n2 = n1 + 1;n2 < 9;n2++) {
                if(data[i][n2]) {
                    continue;
                }
                let ex = 0b111111111 ^ (blocked[i][n1] & blocked[i][n2]);
                if(getbit1(ex) == 2) {
                    console.log('found ex ' + ex.toString(2) + ' at row ' + (i+1))
                    // found a case
                    for(let j = 0;j < 9;j++) {
                        if(j != n1 && j != n2) {
                            blocked[i][j] |= ex;
                        }
                    }
                }
            }
        }
    }
    // column
    for(let i = 0;i < 9;i++) {
        for(let n1 = 0;n1 < 9;n1++) {
            if(data[n1][i]) {
                continue;
            }
            for(let n2 = n1 + 1;n2 < 9;n2++) {
                if(data[n2][i]) {
                    continue;
                }
                let ex = 0b111111111 ^ (blocked[n1][i] & blocked[n2][i]);
                if(getbit1(ex) == 2) {
                    console.log('found ex ' + ex.toString(2) + ' at column ' + (i+1))
                    // found a case
                    for(let j = 0;j < 9;j++) {
                        if(j != n1 && j != n2) {
                            blocked[j][i] |= ex;
                        }
                    }
                }
            }
        }
    }
}

// how many bits are set
function getbit1(b) {
    let cnt = 0;
    while(b) {
        b &= (b-1);
        cnt++;
    }
    return cnt;
}
// how many bits are not set
function getbit0(b) {
    return getbit1(0b111111111 ^ b);
}