using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleApplication3
{
    using System.IO;

    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length == 1)
            {
                int count = 0;
                bool isWord = false;

                for (int i = 0; i < args[0].Length; i++)
                {
                    if (char.IsLetter(args[0][i]))
                    {
                        if(!isWord) isWord = true;
                    }
                    else
                    {
                        if (isWord)
                        {
                            count++;
                            isWord = false;
                        }
                    }
                }

                if (isWord) count++;

                Console.WriteLine(count);
            }
            else
            {

                Console.WriteLine(string.Format("Usage: {0} $text$", Path.GetFileName(Environment.GetCommandLineArgs()[0])));
            }

            //Console.ReadKey();
        }
    }
}
