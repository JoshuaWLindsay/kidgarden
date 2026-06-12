#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');

const requireFromRoot = createRequire(`${process.cwd()}/`);
const task = process.argv[2];

if (
  process.env.npm_node_execpath &&
  process.env.npm_node_execpath !== process.execPath
) {
  const reexec = spawnSync(
    process.env.npm_node_execpath,
    [__filename, ...process.argv.slice(2)],
    { stdio: 'inherit' }
  );
  process.exit(reexec.status ?? 1);
}

if (!task) {
  console.error('[with-next] Missing Next.js command (dev/build/start).');
  process.exit(1);
}

function resolveSwcPackage() {
  const platform = process.platform;
  const arch = process.arch;
  const supportedPlatforms = new Set(['darwin', 'linux', 'win32']);
  const supportedArch = new Set(['x64', 'arm64', 'arm']);

  if (!supportedPlatforms.has(platform) || !supportedArch.has(arch)) {
    return null;
  }

  return `@next/swc-${platform}-${arch}`;
}

function runNpmInstall(pkgSpec) {
  const npmExecPath = process.env.npm_execpath;
  if (!npmExecPath) {
    return { status: 1 };
  }

  return spawnSync(
    process.execPath,
    [npmExecPath, 'install', '--no-save', '--include=optional', pkgSpec],
    { stdio: 'inherit' }
  );
}

function ensureSwcBinary() {
  const swcPkg = resolveSwcPackage();
  if (!swcPkg) {
    return;
  }

  try {
    requireFromRoot.resolve(swcPkg);
    return;
  } catch (_) {
    // Install below.
  }

  let nextPkg;
  try {
    nextPkg = requireFromRoot('next/package.json');
  } catch (err) {
    console.error('[with-next] Could not read next/package.json.');
    process.exit(1);
  }

  const swcVersion =
    nextPkg.optionalDependencies && nextPkg.optionalDependencies[swcPkg];

  if (!swcVersion) {
    console.error(
      `[with-next] ${swcPkg} is missing and no matching optional dependency was found in next@${nextPkg.version}.`
    );
    process.exit(1);
  }

  const pkgSpec = `${swcPkg}@${swcVersion}`;
  console.warn(
    `[with-next] Missing ${swcPkg}. Attempting to install ${pkgSpec}...`
  );

  const installResult = runNpmInstall(pkgSpec);
  if (installResult.status !== 0) {
    console.error('[with-next] Failed to install the required SWC binary.');
    console.error(
      '[with-next] Make sure you run npm in the same architecture as node, then run: npm install --include=optional'
    );
    process.exit(installResult.status || 1);
  }

  try {
    requireFromRoot.resolve(swcPkg);
  } catch (_) {
    console.error(
      `[with-next] ${swcPkg} is still unavailable after installation.`
    );
    process.exit(1);
  }
}

function runNext() {
  let nextBin;
  try {
    nextBin = requireFromRoot.resolve('next/dist/bin/next');
  } catch (_) {
    console.error('[with-next] Could not resolve next CLI binary.');
    process.exit(1);
  }

  const args = [nextBin, ...process.argv.slice(2)];
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  process.exit(result.status || 0);
}

ensureSwcBinary();
runNext();
