#!/usr/bin/env python
# encoding: utf-8
import re, os, sys, time, urllib2, getopt
import fileinput

def main():
    # try:
    #     opts, args = getopt.getopt(sys.argv[1:], "ho:v", ["help", "output="])
    # except getopt.GetoptError, err:
    #     # print help information and exit:
    #     print str(err) # will print something like "option -a not recognized"
    #     usage()
    #     sys.exit(2)
    # output = None
    # verbose = False
    # for o, a in opts:
    #     if o == "-u":
    #         verbose = True
    #     elif o in ("-h", "--help"):
    #         usage()
    #         sys.exit()
    #     elif o in ("-o", "--output"):
    #         output = a
    #     else:
    #         assert False, "unhandled option"
    print("about to build")
    bob_the_builder()


def usage():
    print("USAGE: buildit.py [-r REV] repos-path file")
    sys.exit(1)

def patch_file(file, version):
    data = open(file).read()
    o = open(file, 'w')
    data = re.sub("FFVERSION",str(version),data)
    data = re.sub("FFMINORVERSION",str(version),data)
    o.write(data)
    o.close()
#    for line in fileinput.FileInput(file,inplace=1):
#        if "[VERSION]" in line:
#             line=line.replace("[VERSION]",str(version))
        # if "[MINORVERSION]" in line:
        #     line=line.replace("[MINORVERSION]",str(version))
    #print "Patched "+str(file)+" on line"+line
    #return

def bob_the_builder():
    print("Bob be building")
    os.popen("mkdir build/")
    os.popen("rm -rf dsb.xpi")
    os.popen("cp -R chrome build/")
    os.popen("cp -R components build/")
    os.popen("cp -R translations build/")
    os.popen("cp -R defaults build/")
    os.popen("cp -R install.rdf build/")
    os.popen("cp -R chrome.manifest build/")
    os.popen("cp -R license.txt build/")
    os.popen("find build/ -name '.DS_Store' | xargs rm -f")
    os.chdir("build")
    os.popen("zip -r ../dsb.xpi ./")
    os.chdir("../")
    os.popen("rm -rf /Users/chrishughes/Library/Application\ Support/Firefox/Profiles/x0uq69a7.DSBTEST/extensions/{D4DD63FA-01E4-46a7-B6B1-EDAB7D6AD389}.xpi")
    os.popen("cp dsb.xpi /Users/chrishughes/Library/Application\ Support/Firefox/Profiles/x0uq69a7.DSBTEST/extensions/{D4DD63FA-01E4-46a7-B6B1-EDAB7D6AD389}.xpi")
    os.popen("rm -rf build")

if __name__ == "__main__":
    main()
