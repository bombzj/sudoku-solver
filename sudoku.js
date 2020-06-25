function solve(data) {
    // data[row][col]
    // prepare
    let col = new Uint16Array(9);
    let row = new Uint16Array(9);
    let block = new Uint16Array(9);
    for(let i = 0;i < 9;i++) {
        let b = Math.floor(i / 3) * 3;  // block 0 - 8
        for(let j = 0;j < 9;j++) {
            let b2 = b + Math.floor(j / 3);
            let d = data[i][j];
            if(d > 0) {
                col[i] |= 1 << d;
                row[j] |= 1 << d;
                block[b2] |= 1 << d;
            }
        }
    }

    // compute
    let blocked = [];   // numbers that are occupied by other position (bit wise)
    for(let i = 0;i < 9;i++) {
        blocked[i] = new Uint16Array(9);

        let b = Math.floor(i / 3) * 3;  // block 0 - 8
        for(let j = 0;j < 9;j++) {
            if(data[i][j] == 0) {
                let b2 = b + Math.floor(j / 3);
                blocked[i][j] = col[i] | row[j] | block[b2];
            } else {
                blocked[i][j] = 0b1111111111;
            }
        }
    }

    // display blocked array
    for(let i = 0;i < 9;i++) {
        for(let j = 0;j < 9;j++) {
            s2.innerHTML += (blocked[i][j]>>1).toString(2) + ' ';
        }
        s2.innerHTML += '<br/>';
    }

    // looking for slot that number can fit
    let found;
    for(let i = 0;i < 9;i++) {
        for(let n = 1;n < 10;n++) {
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
                console.log("put " + n + ' at ' + i + '/' + found);
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
                console.log("put " + n + ' at ' + found + '/' + i);
            }
            //  else if(found == -1) {
            //     console.log("error " + n + ' at row ' + i);
            // }

            let row2 = Math.floor(i / 3) * 3;  // block 0 - 8
            let col2 = (i % 3) * 3;
            found = -1;
            for(let j = 0;j < 9;j++) {
                let row3 = Math.floor(j / 3);  // block 0 - 8
                let col3 = j % 3;
                if((blocked[row2 + row3][col2 + col3] & bitn) == 0) {
                    if(found == -1) {
                        found = j;
                    } else {
                        found = -2; // multiple possibility
                        break;
                    }
                }
            }
            if(found >= 0) {
                let row3 = Math.floor(found / 3);  // block 0 - 8
                let col3 = found % 3;
                console.log("put " + n + ' at ' + (row2 + row3) + '/' + (col2 + col3));
            }
        }

        
    }

    // looking for number to fit slot
    for(let i = 0;i < 9;i++) {
        for(let j = 0;j < 9;j++) {
            let found = -1;
            for(let n = 1;n < 10;n++) {
                if((blocked[i][j] & (1 << n)) == 0) {
                    if(found == -1) {
                        found = n;
                    } else {
                        found = -2;
                        break;
                    }
                    
                }
            }
            if(found > 0) {
                console.log("put " + found + ' at ' + i + '/' + j);
            }
        }
    }
    // display
    let ret = '';
    for(let i = 0;i < 9;i++) {
        for(let j = 0;j < 9;j++) {
            ret += data[i][j] + ' ';
        }
        ret += '<br/>';
    }
   
    return ret;
}