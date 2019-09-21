#!/usr/bin/env python3
import sys
import os
import pathlib
import typing

def die(msg):
    print(msg)
    exit(1)

def line_to_path(base_path, line):
    path = pathlib.Path(base_path, line.lstrip('/'))
    return path

def get_filenames_from_droplist(base_path, path):
    lines = path.read_text().strip().splitlines()
    return [line_to_path(base_path, line) for line in lines if line]

def drop_paths(paths, output_dir):
    for f in paths:
        assert f.is_file()
        f.unlink()
        print(f"Removed {f.relative_to(output_dir)}")

def main():
    if len(sys.argv) != 2:
        die(f'Usage: {sys.argv[0]} [hugo-output-directory]')

    output_dir = pathlib.Path(sys.argv[1])

    if not output_dir.is_dir():
        die(f'{output_dir} must be a hugo output directory')

    all_droplists = list(output_dir.rglob('*.droplist'))
    all_files_to_drop = [f for droplist in all_droplists for f in get_filenames_from_droplist(output_dir, droplist)]
    drop_paths(all_files_to_drop, output_dir)
    drop_paths(all_droplists, output_dir)


if __name__ == "__main__":
    main()
