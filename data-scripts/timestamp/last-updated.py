from datetime import datetime 
import os

dir_path = os.path.dirname(os.path.realpath(__file__))
repo_root = os.path.abspath(os.path.join(dir_path, '..', '..'))

def main():
    today = datetime.now()
    outpath = os.path.join(repo_root, 'last_updated.txt')
    with open(outpath, 'w') as f:
        f.write(today.strftime("%d/%m/%Y %H:%M:%S"))

if __name__ == "__main__":
    main()