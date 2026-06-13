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
  const supportedArch = new Set(['x64', 'arm64', 'arm']);

  // Only darwin uses the bare `@next/swc-<platform>-<arch>` name. linux and
  // win32 packages carry an ABI/libc suffix (e.g. -gnu, -musl, -msvc) that we
  // can't reliably reconstruct here, so we skip the auto-install probe and let
  // npm's optional-dependency resolution (lockfile + .npmrc include=optional)
  // provide the right binary, with `next` reporting any genuine problem.
  if (platform !== 'darwin' || !supportedArch.has(arch)) {
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

  // Everything below is best-effort: if we can't auto-install the SWC binary
  // we fall through and let `next` run, since the binary may already be
  // present under a name we don't probe, and `next` reports real failures.
  let nextPkg;
  try {
    nextPkg = requireFromRoot('next/package.json');
  } catch (_) {
    console.warn('[with-next] Could not read next/package.json; skipping SWC check.');
    return;
  }

  const swcVersion =
    nextPkg.optionalDependencies && nextPkg.optionalDependencies[swcPkg];

  if (!swcVersion) {
    console.warn(
      `[with-next] No matching optional dependency for ${swcPkg} in next@${nextPkg.version}; letting next resolve SWC.`
    );
    return;
  }

  const pkgSpec = `${swcPkg}@${swcVersion}`;
  console.warn(
    `[with-next] Missing ${swcPkg}. Attempting to install ${pkgSpec}...`
  );

  const installResult = runNpmInstall(pkgSpec);
  if (installResult.status !== 0) {
    console.warn('[with-next] Could not install the SWC binary automatically.');
    console.warn(
      '[with-next] If the build fails, run: npm install --include=optional'
    );
    return;
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
