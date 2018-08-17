const fs = require("fs");
const proc = require("child_process");
const path = require("path");

const skipList = ['GlobalStyles', 'node_modules'];

// --cleanup
const CLEANUP_FIRST = process.argv.includes('--cleanup');
const UNPUBLISH_LATEST_VERSION = process.argv.includes('--unpublish-latest-version');
const UNPUBLISH_ALL = process.argv.includes('--unpublish-all');
const UPDATE_CROSS_DEPS = process.argv.includes('--update-crossdeps') || true;
const PUBLISH = process.argv.includes('--publish') || true;
const FORCE_UPDATE = process.argv.includes('--force-update') || false;
const HELP = process.argv.includes('-h') || process.argv.length == 2 || false;

const unpublishAll = (items, all = false) => {
    items.forEach((item) => {
        const cwd = `./${item}`;
        fs.lstat(cwd, (err, stats) => {
            if (!err) {
                const packageJson = `${cwd}\\package.json`;
                if (stats.isDirectory() && fs.existsSync(packageJson)) {
                    const json = JSON.parse(fs.readFileSync(packageJson));
                    console.log(`Current module is ${json.name}`);
                    console.log(`Current directory is ${cwd}`);

                    const latest = getRemoteVersion(json.name, cwd);
                    const cmdOptsUnpublish = all === true ? `npm unpublish ${json.name} --force` : `npm unpublish ${json.name}@${latest}`;
                    let out = proc.execSync(cmdOptsUnpublish, cwd);
                    console.log(out);
                }
            }
        });
    });
};

const installedPkgs = [];

const getFullPackagesList = (items) => {
    const allPackages = [];
    items.filter((item) => !skipList.includes(item)).forEach((item) => {
        const cwd = `./${item}`;
        const stats = fs.lstatSync(cwd);
        if (stats.isDirectory() && isProjectFolder(cwd)) {
            const json = getPackageJson(cwd);
            if (!allPackages.includes(json.name)) {
                allPackages.push(json.name);
            }
        }
    });
    return allPackages;
};

const cleanup = (items) => {
    items.filter((item) => !skipList.includes(item)).forEach((item) => {
        const cwd = `./${item}`;
        const stats = fs.lstatSync(cwd);

        if (stats.isDirectory() && isProjectFolder(cwd)) {

            let out = proc.execSync("rimraf node_modules lib package-lock.json yarn.lock", {cwd, shell: true});
            console.log(`Cleanup folder ${cwd}: ${out.toString()}`);
        }
    });
};

const isCommonComponent = (name) => {
    return name.startsWith('dnn-') && name !== 'dnn-global-styles' && name !== 'dnn-api' && name !== 'dnn-flag' && name !== 'dnn-token-service';
};

const checkDeps = (pkjs) => {
    if (pkjs.dependencies) {
        for (let pkg of Object.keys(pkjs.dependencies)) {
            const hasDnnDeps = isCommonComponent(pkg) && !installedPkgs.includes(pkg);
            if (hasDnnDeps) {
                console.log(`Error in ${pkjs.name}: missing dependency ${pkg}`);
                return false; // check failed
            }
        }
    }
    if (pkjs.devDependencies) {
        for (let pkg of Object.keys(pkjs.devDependencies)) {
            const hasDnnDeps = isCommonComponent(pkg) && !installedPkgs.includes(pkg);
            const hasEslintDeps = pkg == 'eslint-config-dnn' && !installedPkgs.includes(pkg);
            if (hasEslintDeps || hasDnnDeps) {
                console.log(`Error in ${pkjs.name}: missing dependency ${pkg}`);
                return false; // check failed
            }
        }
    }
    return true; // passed check

};

/**
 * experimental
 * Update dependencies from common components to the latest version
 * @param pkjs
 */
const updateDeps = (name) => {
    const pkjs = getPackageJson(packagesPathsCache[name]);
    if (pkjs.dependencies) {
        for (let pkg of Object.keys(pkjs.dependencies)) {
            const isUpToDate = isCommonComponent(pkg) && installedPkgs.includes(pkg);
            if (isUpToDate) {
                const latestVersion = getRemoteVersion(pkg);
                pkjs.dependencies[pkg] = latestVersion;
            }
        }
    }
    if (pkjs.devDependencies) {
        for (let pkg of Object.keys(pkjs.devDependencies)) {
            const isUpToDate = isCommonComponent(pkg) && installedPkgs.includes(pkg);
            if (isUpToDate) {
                const latestVersion = getRemoteVersion(pkg);
                pkjs.devDependencies[pkg] = latestVersion;
            }
        }
    }
    try {
        const json = JSON.stringify(pkjs, null, 2);
        fs.writeFileSync(`${packagesPathsCache[pkjs.name]}/package.json`, json);
    } catch (e) {
        console.log(`WARINING: Cannot update dependencies of ${pkjs.nam}: ${e}`);
    }
};

function getNextVersion(localVersion, remoteVersion, json) {
    const VERSION_COMPARE = compareVersions(localVersion, remoteVersion);
    if (FORCE_UPDATE === true || VERSION_COMPARE > 0) {
        const newVer = upgradeVersion(json.name, remoteVersion); //proc.execSync("npm version patch", {cwd, shell: true});
        localVersion = stripVersionTagPrefix(newVer);
        console.log(`Version update from ${json.version} to ${localVersion}`);
    } // new version || FORCE_UPDATE
    return localVersion;
}

const publishAll = (items) => {
    const promises = [];
    items.filter((item) => !skipList.includes(item)).forEach((item) => {
        const cwd = `./${item}`;
        const stats = fs.lstatSync(cwd);

        if (stats.isDirectory() && isProjectFolder(cwd)) {

            try {
                const json = getPackageJson(cwd);
                const canInstall = checkDeps(json);
                if (canInstall === true && !installedPkgs.includes(json.name)) {
                    console.log(`### INSTALLING ${json.name} ###`);

                    try {

                        const remoteVersion = getRemoteVersion(json.name, cwd);
                        let localVersion = json.version;

                        let out = '';

                        const EXPECTED_VERSION = getNextVersion(localVersion, remoteVersion, json);

                        if(compareVersions(EXPECTED_VERSION, remoteVersion) > 0) {
                            if (UPDATE_CROSS_DEPS === true) updateDeps(json.name);

                            console.log(`Installing dependencies of ${json.name}`);
                            out = proc.execSync("npm i", {cwd, shell: true});
                            console.log(out.toString());


                            const cmdOptsPublish = `npm publish`;
                            out = proc.execSync(cmdOptsPublish, {cwd, shell: true});
                            console.log(out.toString());

                            const p = new Promise((resolve, reject) => {
                                const itvId = setInterval(() => {
                                    const PUBLISHED_VERSION = getRemoteVersion(json.name, cwd);
                                    if (EXPECTED_VERSION == PUBLISHED_VERSION) {
                                        resolve(json.name);
                                        installedPkgs.push(json.name);
                                        clearInterval(itvId);
                                    } else {
                                        console.log(`Expected version ${EXPECTED_VERSION} current ${PUBLISHED_VERSION}, retry in 5 seconds`);
                                    }
                                }, 5000);
                            });
                            promises.push(p);
                        } else {
                            const p = new Promise((resolve, reject) => {
                                resolve(json.name);
                                installedPkgs.push(json.name);
                            });
                            promises.push(p);
                        }

                    } catch (e) {
                        console.log(`Error installing ${json.name}: ${e}`);
                    }
                }
            } catch (e) {
                console.log(`Error: ${e}`);
            }
        }
    });
    return promises;
};

const stripVersionTagPrefix = (version) => {
    const res = version.replace(/[^\d^\.]/, '');
    return res;
};

const getRemoteVersion = (pkg, cwd = '.', prefix = false) => {
    const cmd = `npm show ${pkg} version`;
    const out = proc.execSync(cmd, {cwd, shell: true});
    const version = out.toString().trim();
    return `${prefix === true ? "v" : ""}${version}`;
};

const compareVersions = (locale, remote) => {
    const s1 = locale.split('.');
    const s2 = remote.split('.');

    for (let i = 0; i < s1.length; i++) {
        const v1 = parseInt(s1[i]);
        const v2 = s2[i] != undefined ? parseInt(s2[i]) : 0;
        if (v1 < v2) {
            return -1;
        }
        if (v1 > v2) {
            return 1;
        }
    }
    return 0;
};

const upgradeVersion = (name, remote, prefix = false) => {
    const s = remote.split('.');
    s[s.length - 1]++;
    const up2date = `${prefix ? 'v' : ''}${s.join('.')}`;
    console.log(`UPGRADE TO: ${up2date}`);
    const json = getPackageJson(packagesPathsCache[name]);
    json.version = up2date;
    const fpath = `${packagesPathsCache[name]}/package.json`;
    fs.writeFileSync(fpath, JSON.stringify(json, null, 2));
    return up2date;
};

const isProjectFolder = (cwd) => {
    const fullpath = path.resolve(cwd);
    const pkg = `${fullpath}\\package.json`;
    return fs.existsSync(pkg);
};

const getPackageJson = (cwd) => {
    const fullpath = path.resolve(cwd);
    const packageJson = `${fullpath}\\package.json`;
    if (!fs.existsSync(packageJson)) {
        throw new Error(`File not found ${packageJson}`);
    }

    const json = JSON.parse(fs.readFileSync(packageJson));
    return json;
};

const ctrl = (items) => {
    const proms = publishAll(items);
    if (proms.length > 0) {
        Promise.all(proms).then(([...res]) => {
            console.log(res);
            ctrl(items);
        });
    }
};

const packagesPathsCache = {};
const packagesPaths = (items) => {
    items.forEach((item) => {
        const cwd = `./${item}`;
        const stats = fs.lstatSync(cwd);

        if (stats.isDirectory() && isProjectFolder(cwd)) {
            try {
                const packageJson = getPackageJson(cwd);
                packagesPathsCache[packageJson.name] = cwd;
            } catch (e) {
                console.log(`package ${cwd}/package.json doesn't exist`);
            }
        }
    });
};

fs.readdir(".", function (err, items) {
    packagesPaths(items);

    console.log(`UNPUBLISH ${UNPUBLISH_LATEST_VERSION},PUBLISH_ALL ${UNPUBLISH_ALL}, CLEANUP ${CLEANUP_FIRST}, PUBLISH ${PUBLISH} UPDATE CROSS-DEPS ${UPDATE_CROSS_DEPS}, FORCE_UPDATE == ${FORCE_UPDATE}`);

    if(HELP === true) {
        console.log(`
            Example: node npm-publish-all --publish --update-crossdeps
            
            Options:
            -h Shows this help
            --cleanup remove each node_modules before to install/update a component
            --force-update re-install and upgrade build number all components, regardless of actual changes
            --publish components to the current NPM registry (use carefully)
            --unpublish-latest-version Unpublish latest version of components from the current NPM registry (use carefully)
            --unpublish-all Unpublish componenents totally from the current NPM registry (use carefully)
            --update-crossdeps Update dependencies to Common Components to the latest available to avoid obsolete dependencies
        `);
    } else {
        if (UNPUBLISH_LATEST_VERSION === true) unpublishAll(items);
        if (UNPUBLISH_ALL === true) unpublishAll(items, true);
        if (CLEANUP_FIRST === true) cleanup(items);
        if (PUBLISH === true) ctrl(items);
    }

});